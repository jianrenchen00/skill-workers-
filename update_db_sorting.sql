-- Function to search and sort sponsors with custom logic (Alphanumeric first)
create or replace function get_sponsors_sorted(
  search_query text default '',
  page_number int default 1,
  page_size int default 20
)
returns table (
  id uuid,
  organisation_name text,
  town_city text,
  county text,
  type_rating text,
  route text,
  total_count bigint
)
language plpgsql
as $$
declare
  offset_val int;
begin
  offset_val := (page_number - 1) * page_size;
  
  return query
  with filtered as (
    select 
      v.id, 
      v.organisation_name, 
      v.town_city, 
      v.county, 
      v.type_rating, 
      v.route,
      count(*) over() as full_count
    from visa_sponsors v
    where 
      case when search_query = '' then true
      else v.organisation_name ilike '%' || search_query || '%'
      end
  )
  select 
    f.id, f.organisation_name, f.town_city, f.county, f.type_rating, f.route, f.full_count
  from filtered f
  order by 
    -- Sort priority: 0 for Alphanumeric start, 1 for others (symbols)
    case when f.organisation_name ~ '^[a-zA-Z0-9]' then 0 else 1 end asc,
    f.organisation_name asc
  limit page_size offset offset_val;
end;
$$;
