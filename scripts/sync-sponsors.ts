import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import { Readable } from 'stream';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const LANDING_PAGE_URL = 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers';

async function getLatestCsvUrl() {
    console.log('Fetching landing page to find latest CSV...');
    try {
        const response = await fetch(LANDING_PAGE_URL);
        const text = await response.text();
        // Regex to find the CSV link. 
        // Supports /government/uploads/... and /media/... paths
        const match = text.match(/(https:\/\/assets\.publishing\.service\.gov\.uk)?\/(government\/uploads|media)\/[\w\d\/_-]+\.csv/);

        if (match) {
            const url = match[0].startsWith('http') ? match[0] : `https://assets.publishing.service.gov.uk${match[0]}`;
            return url;
        }
    } catch (error) {
        console.error('Error fetching landing page:', error);
    }

    console.warn('Could not dynamically find CSV URL. Using fallback.');
    return 'https://assets.publishing.service.gov.uk/media/6926e549b3b9afff34e96009/2025-11-26_-_Worker_and_Temporary_Worker.csv';
}

async function syncSponsors() {
    const csvUrl = await getLatestCsvUrl();
    console.log(`Downloading CSV from: ${csvUrl}`);

    const response = await fetch(csvUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const results: any[] = [];
    const stream = Readable.fromWeb(response.body as any);

    console.log('Parsing CSV...');

    await new Promise((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Parsed ${results.length} rows. Starting database sync...`);

    // Batch insert/upsert
    const BATCH_SIZE = 1000;
    let processed = 0;

    console.log('Truncating existing visa_sponsors table...');
    const { error: deleteError } = await supabase.from('visa_sponsors').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    if (deleteError) {
        console.error('Error truncating table:', deleteError);
        return;
    }

    for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE).map(row => ({
            organisation_name: row['Organisation Name'],
            town_city: row['Town/City'],
            county: row['County'],
            type_rating: row['Type & Rating'],
            route: row['Route'],
            last_synced_at: new Date().toISOString(),
        }));

        const { error } = await supabase.from('visa_sponsors').insert(batch);

        if (error) {
            console.error(`Error inserting batch ${i}:`, error);
        } else {
            processed += batch.length;
            process.stdout.write(`\rProcessed: ${processed}/${results.length}`);
        }
    }

    console.log('\nSync complete!');
}

syncSponsors().catch(console.error);
