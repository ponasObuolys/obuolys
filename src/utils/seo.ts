/**
 * SEO Utility Functions
 * Helper functions for generating SEO-friendly meta tags, structured data, and URLs
 */

export interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const SITE_CONFIG = {
  name: 'ponas Obuolys',
  domain: 'https://ponasobuolys.lt',
  defaultTitle: 'ponas Obuolys - AI naujienos, įrankiai ir kursai Lietuvoje',
  defaultDescription:
    'Dirbtinio intelekto naujienos, įrankiai, kursai ir straipsniai lietuvių kalba. AI ekspertas Lietuvoje - ponas Obuolys',
  defaultImage: 'https://ponasobuolys.lt/opengraph-image.png',
  twitterHandle: '@ponasobuolys',
  facebookAppId: 'your-app-id',
  locale: 'lt_LT',
  type: 'website',
  author: 'ponas Obuolys',
};

/**
 * Generate full page title with site name
 */
export const generateTitle = (pageTitle?: string): string => {
  if (!pageTitle) return SITE_CONFIG.defaultTitle;
  return `${pageTitle} | ${SITE_CONFIG.name}`;
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.domain}${cleanPath}`;
};

/**
 * Generate image URL (handles relative and absolute URLs)
 */
export const generateImageUrl = (imagePath?: string): string => {
  if (!imagePath) return SITE_CONFIG.defaultImage;
  if (imagePath.startsWith('http')) return imagePath;
  return `${SITE_CONFIG.domain}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

/**
 * Generate robots meta content
 */
export const generateRobotsContent = (noindex = false, nofollow = false): string => {
  const robots: string[] = [];
  robots.push(noindex ? 'noindex' : 'index');
  robots.push(nofollow ? 'nofollow' : 'follow');
  return robots.join(', ');
};

/**
 * Generate keywords meta content
 */
export const generateKeywords = (keywords: string[] = []): string => {
  const defaultKeywords = [
    'dirbtinis intelektas',
    'AI naujienos',
    'AI Lietuva',
    'ponas Obuolys',
    'AI įrankiai',
    'AI kursai',
    'ChatGPT',
    'machine learning',
  ];
  return [...new Set([...keywords, ...defaultKeywords])].join(', ');
};

/**
 * Truncate description to optimal length
 */
export const truncateDescription = (description: string, maxLength = 160): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3).trim() + '...';
};

/**
 * Generate Article SEO configuration
 */
export const generateArticleSEO = (article: {
  title: string;
  description?: string;
  content?: string;
  slug: string;
  image?: string;
  published_at?: string;
  updated_at?: string;
  tags?: string[];
}): PageSEO => {
  const description =
    article.description ||
    truncateDescription(
      article.content?.replace(/<[^>]*>/g, '').substring(0, 200) || SITE_CONFIG.defaultDescription
    );

  return {
    title: article.title,
    description,
    canonical: generateCanonicalUrl(`/publikacijos/${article.slug}`),
    image: generateImageUrl(article.image),
    type: 'article',
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    author: SITE_CONFIG.author,
    section: 'AI Naujienos',
    tags: article.tags,
    keywords: [...(article.tags || []), 'AI naujienos Lietuva', 'dirbtinis intelektas'],
  };
};

/**
 * Generate Tool SEO configuration
 */
export const generateToolSEO = (tool: {
  title: string;
  description?: string;
  slug: string;
  image?: string;
  category?: string;
}): PageSEO => {
  return {
    title: `${tool.title} - AI Įrankis`,
    description:
      tool.description ||
      `${tool.title} - dirbtinio intelekto įrankis. Sužinokite daugiau apie AI įrankius su ponas Obuolys`,
    canonical: generateCanonicalUrl(`/irankiai/${tool.slug}`),
    image: generateImageUrl(tool.image),
    type: 'article',
    section: 'AI Įrankiai',
    keywords: [tool.title, 'AI įrankiai', 'dirbtinis intelektas', tool.category || ''].filter(
      Boolean
    ),
  };
};

/**
 * Generate Course SEO configuration
 */
export const generateCourseSEO = (course: {
  title: string;
  description?: string;
  slug: string;
  image?: string;
  level?: string;
}): PageSEO => {
  return {
    title: `${course.title} - AI Kursas`,
    description:
      course.description ||
      `${course.title} - dirbtinio intelekto kursas lietuvių kalba. Mokykitės AI su ponas Obuolys`,
    canonical: generateCanonicalUrl(`/kursai/${course.slug}`),
    image: generateImageUrl(course.image),
    type: 'article',
    section: 'AI Kursai',
    keywords: [course.title, 'AI kursai', 'dirbtinis intelektas', course.level || ''].filter(
      Boolean
    ),
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Generate Organization structured data
 */
export const generateOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/logo.png`,
    description: SITE_CONFIG.defaultDescription,
    sameAs: [
      'https://www.facebook.com/ponasobuolys',
      'https://twitter.com/ponasobuolys',
      'https://www.linkedin.com/company/ponasobuolys',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'Lithuanian',
    },
  };
};

/**
 * Generate Article structured data
 */
export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  published_at?: string;
  updated_at?: string;
  author?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: generateImageUrl(article.image),
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.author || SITE_CONFIG.author,
      url: SITE_CONFIG.domain,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': generateCanonicalUrl(`/publikacijos/${article.slug}`),
    },
  };
};

/**
 * Generate Course structured data
 */
export const generateCourseStructuredData = (course: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  level?: string;
  duration?: string;
  price?: number;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      sameAs: SITE_CONFIG.domain,
    },
    image: generateImageUrl(course.image),
    coursePrerequisites: course.level,
    timeRequired: course.duration,
    offers: course.price
      ? {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'EUR',
        }
      : undefined,
    url: generateCanonicalUrl(`/kursai/${course.slug}`),
  };
};

/**
 * Generate WebSite structured data with search action
 */
export const generateWebSiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    description: SITE_CONFIG.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.domain}/publikacijos?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate Person (Author) structured data
 */
export const generatePersonStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.author,
    url: SITE_CONFIG.domain,
    description: 'AI ekspertas Lietuvoje, dirbtinio intelekto naujienos ir mokymai',
    sameAs: [
      'https://www.facebook.com/ponasobuolys',
      'https://twitter.com/ponasobuolys',
      'https://www.linkedin.com/in/ponasobuolys',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'ChatGPT',
      'AI Tools',
      'AI Education',
    ],
    jobTitle: 'AI Expert',
  };
};

export { SITE_CONFIG };
