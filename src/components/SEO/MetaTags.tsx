import { Helmet } from 'react-helmet-async';
import type { PageSEO } from '@/utils/seo';
import { generateTitle, generateRobotsContent, generateKeywords } from '@/utils/seo';

interface MetaTagsProps extends PageSEO {
  children?: React.ReactNode;
}

/**
 * MetaTags Component
 * Handles all basic meta tags for SEO including title, description, keywords, robots
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
  const fullTitle = generateTitle(title);
  const keywordsContent = generateKeywords(keywords);
  const robotsContent = generateRobotsContent(noindex, nofollow);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywordsContent} />}

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Language */}
      <html lang="lt" />

      {/* Author */}
      <meta name="author" content="ponas Obuolys" />

      {children}
    </Helmet>
  );
};
