import { Helmet } from "react-helmet-async";
import type { PageSEO } from "@/utils/seo";
import { generateImageUrl, generateCanonicalUrl, SITE_CONFIG } from "@/utils/seo";

type OpenGraphTagsProps = PageSEO;

/**
 * OpenGraphTags Component
 * Handles OpenGraph (Facebook) and Twitter Card meta tags for social sharing
 */
export const OpenGraphTags = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: OpenGraphTagsProps) => {
  const ogImage = generateImageUrl(image);
  const ogUrl = canonical || generateCanonicalUrl("/");

  return (
    <Helmet>
      {/* OpenGraph Meta Tags */}
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      {/* Article specific tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && <meta property="article:author" content={author} />}
      {type === "article" && section && <meta property="article:section" content={section} />}
      {type === "article" &&
        tags.map((tag, index) => <meta key={index} property="article:tag" content={tag} />)}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
    </Helmet>
  );
};
