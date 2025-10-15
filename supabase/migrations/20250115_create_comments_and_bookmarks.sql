-- Create comments table for article discussions
CREATE TABLE IF NOT EXISTS article_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES article_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookmarks table for saved articles
CREATE TABLE IF NOT EXISTS article_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(article_id, user_id)
);

-- Create reading progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_position INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(article_id, user_id)
);

-- Enable RLS
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Comments policies
-- Anyone can read approved comments
CREATE POLICY "Anyone can read approved comments"
  ON article_comments FOR SELECT
  USING (is_approved = true AND is_deleted = false);

-- Authenticated users can create comments (pending approval)
CREATE POLICY "Authenticated users can create comments"
  ON article_comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON article_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can soft-delete their own comments
CREATE POLICY "Users can delete own comments"
  ON article_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_deleted = true);

-- Admins can see all comments
CREATE POLICY "Admins can see all comments"
  ON article_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can moderate comments
CREATE POLICY "Admins can moderate comments"
  ON article_comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Bookmarks policies
-- Users can read their own bookmarks
CREATE POLICY "Users can read own bookmarks"
  ON article_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookmarks
CREATE POLICY "Users can create bookmarks"
  ON article_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON article_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Reading progress policies
-- Users can read their own progress
CREATE POLICY "Users can read own progress"
  ON reading_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create/update their progress
CREATE POLICY "Users can upsert own progress"
  ON reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON reading_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON article_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON article_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON article_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON article_comments(is_approved, is_deleted);

CREATE INDEX IF NOT EXISTS idx_bookmarks_article_id ON article_bookmarks(article_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON article_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON article_bookmarks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reading_progress_article_id ON reading_progress(article_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON article_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE article_comments IS 'User comments on articles with moderation support';
COMMENT ON TABLE article_bookmarks IS 'User bookmarked articles for later reading';
COMMENT ON TABLE reading_progress IS 'User reading progress tracking for articles';
