-- CTA Analytics: Click tracking ir statistika
-- Sukurta: 2025-10-16

-- ============================================
-- 1. CTA Clicks lentelė
-- ============================================
CREATE TABLE IF NOT EXISTS public.cta_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cta_id UUID NOT NULL,
  cta_type TEXT NOT NULL CHECK (cta_type IN ('cta_section', 'sticky_message')),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_session_id TEXT,
  page_url TEXT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksai performance'ui
CREATE INDEX idx_cta_clicks_cta_id ON public.cta_clicks(cta_id);
CREATE INDEX idx_cta_clicks_clicked_at ON public.cta_clicks(clicked_at DESC);
CREATE INDEX idx_cta_clicks_cta_type ON public.cta_clicks(cta_type);
CREATE INDEX idx_cta_clicks_context ON public.cta_clicks(context);

-- ============================================
-- 2. RLS Politikos
-- ============================================
ALTER TABLE public.cta_clicks ENABLE ROW LEVEL SECURITY;

-- Visi gali įrašyti clicks (anonymous tracking)
CREATE POLICY "Anyone can insert clicks"
  ON public.cta_clicks
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Tik admin gali skaityti statistiką
CREATE POLICY "Admin can view clicks"
  ON public.cta_clicks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================
-- 3. Analytics View - CTA Performance
-- ============================================
CREATE OR REPLACE VIEW public.cta_performance AS
SELECT 
  cs.id,
  cs.title,
  cs.description,
  cs.button_text,
  cs.context,
  cs.priority,
  cs.active,
  COUNT(cc.id) as total_clicks,
  COUNT(DISTINCT DATE(cc.clicked_at)) as days_active,
  ROUND(COUNT(cc.id)::NUMERIC / NULLIF(COUNT(DISTINCT DATE(cc.clicked_at)), 0), 2) as avg_clicks_per_day,
  MAX(cc.clicked_at) as last_clicked,
  cs.created_at
FROM public.cta_sections cs
LEFT JOIN public.cta_clicks cc ON cc.cta_id = cs.id AND cc.cta_type = 'cta_section'
GROUP BY cs.id, cs.title, cs.description, cs.button_text, cs.context, cs.priority, cs.active, cs.created_at
ORDER BY total_clicks DESC;

-- ============================================
-- 4. Analytics View - Sticky Messages Performance
-- ============================================
CREATE OR REPLACE VIEW public.sticky_performance AS
SELECT 
  sm.id,
  sm.title,
  sm.description,
  sm.cta,
  sm.emoji,
  sm.priority,
  sm.active,
  COUNT(cc.id) as total_clicks,
  COUNT(DISTINCT DATE(cc.clicked_at)) as days_active,
  ROUND(COUNT(cc.id)::NUMERIC / NULLIF(COUNT(DISTINCT DATE(cc.clicked_at)), 0), 2) as avg_clicks_per_day,
  MAX(cc.clicked_at) as last_clicked,
  sm.created_at
FROM public.sticky_cta_messages sm
LEFT JOIN public.cta_clicks cc ON cc.cta_id = sm.id AND cc.cta_type = 'sticky_message'
GROUP BY sm.id, sm.title, sm.description, sm.cta, sm.emoji, sm.priority, sm.active, sm.created_at
ORDER BY total_clicks DESC;

-- ============================================
-- 5. Analytics View - Daily Stats
-- ============================================
CREATE OR REPLACE VIEW public.cta_daily_stats AS
SELECT 
  DATE(clicked_at) as date,
  cta_type,
  context,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT cta_id) as unique_ctas_clicked,
  COUNT(DISTINCT user_session_id) as unique_sessions
FROM public.cta_clicks
GROUP BY DATE(clicked_at), cta_type, context
ORDER BY date DESC;

-- ============================================
-- 6. Function - Get Top Performing CTAs
-- ============================================
CREATE OR REPLACE FUNCTION public.get_top_ctas(
  days_back INTEGER DEFAULT 30,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  cta_id UUID,
  title TEXT,
  context TEXT,
  total_clicks BIGINT,
  avg_daily_clicks NUMERIC,
  conversion_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    cs.title,
    cs.context,
    COUNT(cc.id) as total_clicks,
    ROUND(COUNT(cc.id)::NUMERIC / days_back, 2) as avg_daily_clicks,
    ROUND((COUNT(cc.id)::NUMERIC / days_back) * cs.priority / 100, 2) as conversion_score
  FROM public.cta_sections cs
  LEFT JOIN public.cta_clicks cc ON cc.cta_id = cs.id 
    AND cc.clicked_at >= NOW() - (days_back || ' days')::INTERVAL
  WHERE cs.active = true
  GROUP BY cs.id, cs.title, cs.context, cs.priority
  ORDER BY conversion_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. Function - Get Optimization Recommendations
-- ============================================
CREATE OR REPLACE FUNCTION public.get_cta_recommendations()
RETURNS TABLE (
  recommendation_type TEXT,
  cta_id UUID,
  title TEXT,
  current_priority INTEGER,
  suggested_priority INTEGER,
  reason TEXT,
  impact TEXT
) AS $$
BEGIN
  -- Rekomendacija #1: Padidinti priority populiariems CTA
  RETURN QUERY
  SELECT 
    'increase_priority'::TEXT,
    cs.id,
    cs.title,
    cs.priority,
    LEAST(cs.priority + 20, 100) as suggested_priority,
    'High click rate - increase visibility'::TEXT as reason,
    'High'::TEXT as impact
  FROM public.cta_sections cs
  LEFT JOIN public.cta_clicks cc ON cc.cta_id = cs.id 
    AND cc.clicked_at >= NOW() - INTERVAL '7 days'
  WHERE cs.active = true
  GROUP BY cs.id, cs.title, cs.priority
  HAVING COUNT(cc.id) > 10 AND cs.priority < 80
  ORDER BY COUNT(cc.id) DESC
  LIMIT 5;

  -- Rekomendacija #2: Sumažinti priority nepopuliariems CTA
  RETURN QUERY
  SELECT 
    'decrease_priority'::TEXT,
    cs.id,
    cs.title,
    cs.priority,
    GREATEST(cs.priority - 20, 10) as suggested_priority,
    'Low click rate - decrease visibility'::TEXT as reason,
    'Medium'::TEXT as impact
  FROM public.cta_sections cs
  LEFT JOIN public.cta_clicks cc ON cc.cta_id = cs.id 
    AND cc.clicked_at >= NOW() - INTERVAL '7 days'
  WHERE cs.active = true AND cs.priority > 30
  GROUP BY cs.id, cs.title, cs.priority
  HAVING COUNT(cc.id) < 2
  ORDER BY cs.priority DESC
  LIMIT 5;

  -- Rekomendacija #3: Deaktyvuoti visai nepaspaustas CTA (30+ dienų)
  RETURN QUERY
  SELECT 
    'deactivate'::TEXT,
    cs.id,
    cs.title,
    cs.priority,
    0 as suggested_priority,
    'No clicks in 30 days - consider deactivating'::TEXT as reason,
    'Low'::TEXT as impact
  FROM public.cta_sections cs
  LEFT JOIN public.cta_clicks cc ON cc.cta_id = cs.id 
    AND cc.clicked_at >= NOW() - INTERVAL '30 days'
  WHERE cs.active = true 
    AND cs.created_at < NOW() - INTERVAL '30 days'
  GROUP BY cs.id, cs.title, cs.priority
  HAVING COUNT(cc.id) = 0
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Grant permissions
-- ============================================
GRANT SELECT ON public.cta_performance TO authenticated;
GRANT SELECT ON public.sticky_performance TO authenticated;
GRANT SELECT ON public.cta_daily_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_ctas TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_cta_recommendations TO authenticated;

-- ============================================
-- Migracija baigta!
-- ============================================
