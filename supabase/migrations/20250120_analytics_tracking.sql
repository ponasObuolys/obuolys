-- Create analytics tracking table for page views
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_article_id ON public.page_views(article_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON public.page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);

-- Create site statistics table for yearly totals
CREATE TABLE IF NOT EXISTS public.site_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  total_visitors INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Insert current year if not exists
INSERT INTO public.site_statistics (year, total_visitors, total_page_views)
VALUES (EXTRACT(YEAR FROM NOW())::INTEGER, 0, 0)
ON CONFLICT (year) DO NOTHING;

-- Function to increment site statistics
CREATE OR REPLACE FUNCTION increment_site_stats()
RETURNS TRIGGER 
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public
AS $$
BEGIN
  -- Update statistics for current year
  INSERT INTO public.site_statistics (year, total_visitors, total_page_views, last_updated)
  VALUES (
    EXTRACT(YEAR FROM NEW.viewed_at)::INTEGER,
    1,
    1,
    NOW()
  )
  ON CONFLICT (year) DO UPDATE SET
    total_page_views = site_statistics.total_page_views + 1,
    total_visitors = site_statistics.total_visitors + 
      CASE 
        WHEN NOT EXISTS (
          SELECT 1 FROM public.page_views 
          WHERE session_id = NEW.session_id 
          AND viewed_at < NEW.viewed_at
          AND EXTRACT(YEAR FROM viewed_at) = EXTRACT(YEAR FROM NEW.viewed_at)
        ) THEN 1 
        ELSE 0 
      END,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update statistics
DROP TRIGGER IF EXISTS trigger_increment_site_stats ON public.page_views;
CREATE TRIGGER trigger_increment_site_stats
  AFTER INSERT ON public.page_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_site_stats();

-- Function to get current year statistics
CREATE OR REPLACE FUNCTION get_current_year_stats()
RETURNS TABLE (
  year INTEGER,
  total_visitors INTEGER,
  total_page_views INTEGER
)
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.year,
    s.total_visitors,
    s.total_page_views
  FROM public.site_statistics s
  WHERE s.year = EXTRACT(YEAR FROM NOW())::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_views
CREATE POLICY "Anyone can insert page views"
  ON public.page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own page views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all page views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for site_statistics
CREATE POLICY "Anyone can view site statistics"
  ON public.site_statistics
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify site statistics"
  ON public.site_statistics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON public.site_statistics TO anon, authenticated;
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_year_stats() TO anon, authenticated;
