-- Drop all potential variations of the function to ensure a clean slate
DROP FUNCTION IF EXISTS get_sponsors_sorted(text, int, int);
DROP FUNCTION IF EXISTS get_sponsors_sorted(text, int, int, text);

-- Recreate the function with the correct parameters and logic
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
            -- Search Logic: If search_query is empty/null, match all. Else match name (case-insensitive).
            (search_query IS NULL OR search_query = '' OR s.organisation_name ILIKE '%' || search_query || '%')
            AND
            -- Country Logic: If country_filter is NULL, empty, or 'ALL', match all. Else match exact country code.
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
        -- Sort alphabetically by Organization Name
        fs.organisation_name ASC
    LIMIT 
        page_size
    OFFSET 
        (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql;
