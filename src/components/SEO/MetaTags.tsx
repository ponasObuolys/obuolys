import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import type { PageSEO } from '@/utils/seo';
import { generateTitle, generateRobotsContent, generateKeywords, SITE_CONFIG } from '@/utils/seo';

interface MetaTagsProps extends PageSEO {
  children?: React.ReactNode;
}

/**
 * MetaTags Component
 * Handles all basic meta tags for SEO including title, description, keywords, robots
 * CRITICAL FIX: Always generates dynamic canonical URL to prevent Google indexing conflicts
 */
export const MetaTags = ({
  title,
  description,
  canonical,
  keywords = [],
  noindex = false,
  nofollow = false,
  children,
}: MetaTagsProps) => {
  const location = useLocation();

  const fullTitle = generateTitle(title);
  const keywordsContent = generateKeywords(keywords);
  const robotsContent = generateRobotsContent(noindex, nofollow);

  // CRITICAL: Always use dynamic canonical based on current path
  // This fixes "Multiple conflicting URLs" error in Google Search Console
  const canonicalUrl = canonical || `${SITE_CONFIG.domain}${location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywordsContent} />}

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Canonical URL - ALWAYS present */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Language */}
      <html lang="lt" />

      {/* Author */}
      <meta name="author" content="ponas Obuolys" />

      {children}
    </Helmet>
  );
};
