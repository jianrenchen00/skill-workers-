-- Drop potential old versions of the function to avoid signature conflicts
DROP FUNCTION IF EXISTS get_sponsors_sorted(text, int, int);
DROP FUNCTION IF EXISTS get_sponsors_sorted(text, int, int, text);

-- Recreate the function with the correct country_filter parameter and logic
CREATE OR REPLACE FUNCTION get_sponsors_sorted(
    search_query text,
    page_number int,
    page_size int,
    country_filter text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    organisation_name text,
    town_city text,
    county text,
    type_rating text,
    route text,
    country text,
    total_count bigint
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_sponsors AS (
        SELECT 
            s.* 
        FROM 
            visa_sponsors s
        WHERE 
            -- Search Query Logic: Match name if query is provided
            (search_query IS NULL OR search_query = '' OR s.organisation_name ILIKE '%' || search_query || '%')
            AND
            -- Country Filter Logic: 
            -- 1. If filter is NULL or empty, show all.
            -- 2. If filter is 'ALL', show all.
            -- 3. Otherwise, exact match on country code (e.g., 'IE', 'NL').
            (
                country_filter IS NULL 
                OR country_filter = '' 
                OR country_filter = 'ALL' 
                OR s.country = country_filter
            )
    ),
    total AS (
        SELECT COUNT(*) AS count FROM filtered_sponsors
    )
    SELECT 
        fs.id,
        fs.organisation_name,
        fs.town_city,
        fs.county,
        fs.type_rating,
        fs.route,
        fs.country,
        t.count
    FROM 
        filtered_sponsors fs,
        total t
    ORDER BY 
        fs.organisation_name ASC
    LIMIT 
        page_size
    OFFSET 
        (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql;
