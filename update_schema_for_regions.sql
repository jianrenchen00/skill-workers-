-- Add country column to visa_sponsors table
ALTER TABLE visa_sponsors 
ADD COLUMN IF NOT EXISTS country text DEFAULT 'UK';

-- Create index for country column for faster filtering
CREATE INDEX IF NOT EXISTS idx_visa_sponsors_country ON visa_sponsors(country);

-- Update existing records to have 'UK' as country (though default handles new ones, let's be safe)
UPDATE visa_sponsors SET country = 'UK' WHERE country IS NULL;

-- Optional: If we want to support multi-country jobs, we might need a country column in jobs table too.
-- Let's add it to jobs table as well for consistency.
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS country text DEFAULT 'UK';

CREATE INDEX IF NOT EXISTS idx_jobs_country ON jobs(country);
