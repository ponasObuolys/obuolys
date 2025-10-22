/**
 * Sitemap Generator Utility
 * Generates XML sitemap dynamically from database content
 */

import { supabase } from "@/integrations/supabase/client";
import { secureLogger } from "@/utils/browserLogger";
import { SITE_CONFIG } from "./seo";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Generate sitemap XML from URLs
 */
export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const urlsXML = urls
    .map(
      url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
};

/**
 * Format date to ISO 8601 (YYYY-MM-DD)
 */
const formatDate = (date: string | null): string => {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Generate complete sitemap
 */
export const generateSitemap = async (): Promise<string> => {
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: SITE_CONFIG.domain,
    lastmod: formatDate(null),
    changefreq: "daily",
    priority: 1.0,
  });

  urls.push({
    loc: `${SITE_CONFIG.domain}/publikacijos`,
    changefreq: "daily",
    priority: 0.9,
  });

  urls.push({
    loc: `${SITE_CONFIG.domain}/irankiai`,
    changefreq: "weekly",
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_CONFIG.domain}/kursai`,
    changefreq: "weekly",
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_CONFIG.domain}/kontaktai`,
    changefreq: "monthly",
    priority: 0.5,
  });

  urls.push({
    loc: `${SITE_CONFIG.domain}/paremti`,
    changefreq: "monthly",
    priority: 0.5,
  });

  // Fetch and add articles
  try {
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("slug, updated_at, date, published")
      .eq("published", true)
      .order("date", { ascending: false });

    if (!articlesError && articles) {
      articles.forEach(article => {
        urls.push({
          loc: `${SITE_CONFIG.domain}/publikacijos/${article.slug}`,
          lastmod: formatDate(article.updated_at || article.date),
          changefreq: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    secureLogger.error("Error fetching articles for sitemap", { error });
  }

  // Fetch and add tools
  try {
    const { data: tools, error: toolsError } = await supabase
      .from("tools")
      .select("slug, updated_at, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (!toolsError && tools) {
      tools.forEach(tool => {
        urls.push({
          loc: `${SITE_CONFIG.domain}/irankiai/${tool.slug}`,
          lastmod: formatDate(tool.updated_at || tool.created_at),
          changefreq: "monthly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    secureLogger.error("Error fetching tools for sitemap", { error });
  }

  // Fetch and add courses
  try {
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("slug, updated_at, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (!coursesError && courses) {
      courses.forEach(course => {
        urls.push({
          loc: `${SITE_CONFIG.domain}/kursai/${course.slug}`,
          lastmod: formatDate(course.updated_at || course.created_at),
          changefreq: "monthly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    secureLogger.error("Error fetching courses for sitemap", { error });
  }

  return generateSitemapXML(urls);
};

/**
 * Download sitemap as XML file (for manual generation)
 */
export const downloadSitemap = async () => {
  const xml = await generateSitemap();
  const blob = new Blob([xml], { type: "application/xml" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  a.click();
  window.URL.revokeObjectURL(url);
};
