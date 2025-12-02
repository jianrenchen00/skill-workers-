import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const irelandSponsors = [
    { name: "Google Ireland Limited", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "Meta Ireland", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "Accenture Ireland", city: "Dublin", rating: "General Employment Permit", route: "Intra-Company Transfer" },
    { name: "Amazon Data Services Ireland", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "Microsoft Ireland Operations", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "Intel Ireland", city: "Leixlip", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "Stripe Technology Europe", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "TikTok Technology Limited", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "HubSpot Ireland", city: "Dublin", rating: "General Employment Permit", route: "Critical Skills" },
    { name: "Pfizer Ireland Pharmaceuticals", city: "Cork", rating: "General Employment Permit", route: "Critical Skills" }
];

async function seedIreland() {
    console.log('Seeding Ireland sponsors...');

    const sponsors = irelandSponsors.map(s => ({
        organisation_name: s.name,
        town_city: s.city,
        type_rating: s.rating,
        route: s.route,
        country: 'IE'
    }));

    for (const s of sponsors) {
        // Check if exists
        const { data: existing } = await supabase
            .from('visa_sponsors')
            .select('id')
            .eq('organisation_name', s.organisation_name)
            .single();

        if (!existing) {
            const { error } = await supabase
                .from('visa_sponsors')
                .insert(s);

            if (error) console.error(`Error inserting ${s.organisation_name}:`, error.message);
            else console.log(`Inserted ${s.organisation_name}`);
        } else {
            console.log(`Skipped ${s.organisation_name} (already exists)`);
        }
    }
    console.log('Ireland seeding complete.');
}

seedIreland().catch(console.error);
