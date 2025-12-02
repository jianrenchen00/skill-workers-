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

const euSponsors = [
    // Netherlands
    { name: "Booking.com", city: "Amsterdam", country: "NL", rating: "Recognised Sponsor", route: "Highly Skilled Migrant" },
    { name: "ASML", city: "Veldhoven", country: "NL", rating: "Recognised Sponsor", route: "Highly Skilled Migrant" },
    { name: "Adyen", city: "Amsterdam", country: "NL", rating: "Recognised Sponsor", route: "Highly Skilled Migrant" },
    { name: "Philips", city: "Eindhoven", country: "NL", rating: "Recognised Sponsor", route: "Highly Skilled Migrant" },
    { name: "Uber BV", city: "Amsterdam", country: "NL", rating: "Recognised Sponsor", route: "Highly Skilled Migrant" },

    // Germany
    { name: "SAP SE", city: "Walldorf", country: "DE", rating: "Blue Card", route: "Skilled Worker" },
    { name: "Siemens AG", city: "Munich", country: "DE", rating: "Blue Card", route: "Skilled Worker" },
    { name: "Zalando SE", city: "Berlin", country: "DE", rating: "Blue Card", route: "Skilled Worker" },
    { name: "BMW Group", city: "Munich", country: "DE", rating: "Blue Card", route: "Skilled Worker" },
    { name: "Delivery Hero", city: "Berlin", country: "DE", rating: "Blue Card", route: "Skilled Worker" },

    // France
    { name: "L'Oréal", city: "Clichy", country: "FR", rating: "Passeport Talent", route: "Skilled Worker" },
    { name: "Ubisoft", city: "Montreuil", country: "FR", rating: "Passeport Talent", route: "Skilled Worker" },
    { name: "Dassault Systèmes", city: "Vélizy-Villacoublay", country: "FR", rating: "Passeport Talent", route: "Skilled Worker" },
    { name: "Sanofi", city: "Paris", country: "FR", rating: "Passeport Talent", route: "Skilled Worker" },
    { name: "Criteo", city: "Paris", country: "FR", rating: "Passeport Talent", route: "Skilled Worker" },

    // Sweden
    { name: "Spotify", city: "Stockholm", country: "SE", rating: "Certified Employer", route: "Work Permit" },
    { name: "Klarna", city: "Stockholm", country: "SE", rating: "Certified Employer", route: "Work Permit" },
    { name: "Ericsson", city: "Stockholm", country: "SE", rating: "Certified Employer", route: "Work Permit" },
    { name: "Volvo Group", city: "Gothenburg", country: "SE", rating: "Certified Employer", route: "Work Permit" },
    { name: "H&M Group", city: "Stockholm", country: "SE", rating: "Certified Employer", route: "Work Permit" }
];

async function seedEU() {
    console.log('Seeding EU sponsors...');

    const sponsors = euSponsors.map(s => ({
        organisation_name: s.name,
        town_city: s.city,
        type_rating: s.rating,
        route: s.route,
        country: s.country
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
    console.log('EU seeding complete.');
}

seedEU().catch(console.error);
