export interface Company {
    id: string;
    name: string;
    website?: string;
    logo_url?: string;
    is_verified_sponsor: boolean;
    sponsor_license_tier?: string;
}

export interface Job {
    id: string;
    company_id: string;
    title_en: string;
    title_cn: string;
    description_en: string;
    description_cn: string;
    location: string;
    salary_range: string;
    is_visa_sponsorship_available: boolean;
    country?: string;
    status: 'draft' | 'published' | 'closed';
    created_at: string;
    company?: Company; // Joined data
}
