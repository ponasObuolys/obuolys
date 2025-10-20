-- Function to get trending articles based on recent views
CREATE OR REPLACE FUNCTION get_trending_articles(
  since_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '7 days',
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  views BIGINT,
  image_url TEXT,
  category TEXT[]
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.slug,
    COUNT(DISTINCT pv.session_id)::BIGINT as views,
    a.image_url,
    a.category
  FROM articles a
  LEFT JOIN page_views pv ON pv.article_id = a.id 
    AND pv.viewed_at >= since_date
  WHERE a.published = true
  GROUP BY a.id, a.title, a.slug, a.image_url, a.category
  HAVING COUNT(DISTINCT pv.session_id) > 0
  ORDER BY views DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get device and browser breakdown
CREATE OR REPLACE FUNCTION get_device_breakdown(
  since_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days'
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  WITH device_stats AS (
    SELECT 
      CASE 
        WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'Mobile'
        WHEN user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN 'Tablet'
        ELSE 'Desktop'
      END as device_type,
      COUNT(DISTINCT session_id) as count
    FROM page_views
    WHERE viewed_at >= since_date
    GROUP BY device_type
  ),
  browser_stats AS (
    SELECT 
      CASE 
        WHEN user_agent ILIKE '%edg%' THEN 'Edge'
        WHEN user_agent ILIKE '%chrome%' AND user_agent NOT ILIKE '%edg%' THEN 'Chrome'
        WHEN user_agent ILIKE '%firefox%' THEN 'Firefox'
        WHEN user_agent ILIKE '%safari%' AND user_agent NOT ILIKE '%chrome%' THEN 'Safari'
        WHEN user_agent ILIKE '%opera%' OR user_agent ILIKE '%opr%' THEN 'Opera'
        ELSE 'Other'
      END as browser_name,
      COUNT(DISTINCT session_id) as count
    FROM page_views
    WHERE viewed_at >= since_date
    GROUP BY browser_name
  ),
  total_sessions AS (
    SELECT COUNT(DISTINCT session_id) as total
    FROM page_views
    WHERE viewed_at >= since_date
  )
  SELECT json_build_object(
    'devices', (
      SELECT json_agg(
        json_build_object(
          'type', device_type,
          'count', count,
          'percentage', ROUND((count::NUMERIC / NULLIF(total, 0) * 100)::NUMERIC, 1)
        )
        ORDER BY count DESC
      )
      FROM device_stats, total_sessions
    ),
    'browsers', (
      SELECT json_agg(
        json_build_object(
          'name', browser_name,
          'count', count,
          'percentage', ROUND((count::NUMERIC / NULLIF(total, 0) * 100)::NUMERIC, 1)
        )
        ORDER BY count DESC
      )
      FROM browser_stats, total_sessions
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_trending_articles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_device_breakdown TO anon, authenticated;
