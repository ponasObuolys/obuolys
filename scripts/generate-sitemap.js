/**
 * Sitemap Generation Script
 * Generates static sitemap.xml from Supabase database
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://jzixoslapmlqafrlbvpk.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aXhvc2xhcG1scWFmcmxidnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTg0ODksImV4cCI6MjA1ODkzNDQ4OX0.KZ_ss29tqo3TLFuXqyMa6dj2M4KxjGm9socf8ELVSN0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SITE_DOMAIN = "https://ponasobuolys.lt";

/**
 * Format date to ISO 8601 (YYYY-MM-DD)
 */
const formatDate = date => {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Generate sitemap XML
 */
const generateSitemapXML = urls => {
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
 * Main function
 */
async function generateSitemap() {
  console.log("🚀 Starting sitemap generation...\n");

  const urls = [];

  // Static pages
  console.log("📄 Adding static pages...");
  urls.push({
    loc: SITE_DOMAIN,
    lastmod: formatDate(null),
    changefreq: "daily",
    priority: 1.0,
  });

  urls.push({
    loc: `${SITE_DOMAIN}/publikacijos`,
    changefreq: "daily",
    priority: 0.9,
  });

  urls.push({
    loc: `${SITE_DOMAIN}/irankiai`,
    changefreq: "weekly",
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_DOMAIN}/kursai`,
    changefreq: "weekly",
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_DOMAIN}/kontaktai`,
    changefreq: "monthly",
    priority: 0.5,
  });

  urls.push({
    loc: `${SITE_DOMAIN}/paremti`,
    changefreq: "monthly",
    priority: 0.5,
  });

  console.log(`✅ Added ${urls.length} static pages\n`);

  // Fetch and add articles
  console.log("📰 Fetching articles from database...");
  try {
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("slug, updated_at, date, published")
      .eq("published", true)
      .order("date", { ascending: false });

    if (articlesError) {
      console.error("❌ Error fetching articles:", articlesError);
    } else if (articles) {
      articles.forEach(article => {
        urls.push({
          loc: `${SITE_DOMAIN}/publikacijos/${article.slug}`,
          lastmod: formatDate(article.updated_at || article.date),
          changefreq: "weekly",
          priority: 0.7,
        });
      });
      console.log(`✅ Added ${articles.length} articles\n`);
    }
  } catch (error) {
    console.error("❌ Error fetching articles:", error.message);
  }

  // Fetch and add tools
  console.log("🔧 Fetching tools from database...");
  try {
    const { data: tools, error: toolsError } = await supabase
      .from("tools")
      .select("slug, updated_at, created_at, published")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (toolsError) {
      console.error("❌ Error fetching tools:", toolsError);
    } else if (tools) {
      tools.forEach(tool => {
        urls.push({
          loc: `${SITE_DOMAIN}/irankiai/${tool.slug}`,
          lastmod: formatDate(tool.updated_at || tool.created_at),
          changefreq: "monthly",
          priority: 0.6,
        });
      });
      console.log(`✅ Added ${tools.length} tools\n`);
    }
  } catch (error) {
    console.error("❌ Error fetching tools:", error.message);
  }

  // Fetch and add courses
  console.log("📚 Fetching courses from database...");
  try {
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("slug, updated_at, created_at, published")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (coursesError) {
      console.error("❌ Error fetching courses:", coursesError);
    } else if (courses) {
      courses.forEach(course => {
        urls.push({
          loc: `${SITE_DOMAIN}/kursai/${course.slug}`,
          lastmod: formatDate(course.updated_at || course.created_at),
          changefreq: "monthly",
          priority: 0.6,
        });
      });
      console.log(`✅ Added ${courses.length} courses\n`);
    }
  } catch (error) {
    console.error("❌ Error fetching courses:", error.message);
  }

  // Generate XML
  console.log("📝 Generating sitemap XML...");
  const xml = generateSitemapXML(urls);

  // Write to file
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf8");

  console.log(`\n✅ Sitemap generated successfully!`);
  console.log(`📍 Location: ${outputPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log(`\n🌐 Sitemap will be available at: ${SITE_DOMAIN}/sitemap.xml`);
  console.log("\n📋 Next steps:");
  console.log("1. Commit and push sitemap.xml to repository");
  console.log("2. Deploy to Vercel");
  console.log("3. Verify sitemap at: https://www.ponasobuolys.lt/sitemap.xml");
  console.log("4. Submit to Google Search Console");
}

// Run the script
generateSitemap().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
