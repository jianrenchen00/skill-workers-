-- Check the distribution of sponsors by country
SELECT country, COUNT(*) as count
FROM visa_sponsors
GROUP BY country
ORDER BY count DESC;

-- Check a few examples from Ireland and Netherlands
SELECT organisation_name, country 
FROM visa_sponsors 
WHERE country IN ('IE', 'NL', 'SE')
LIMIT 5;
