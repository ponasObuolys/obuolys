/**
 * Vercel Serverless Function for Prerender.io Integration
 *
 * This function fetches pre-rendered content from Prerender.io
 * when accessed by search engine bots or social media crawlers.
 */

const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || "D9EDsSifvfj3S7qLPh0T";
const PRERENDER_SERVICE_URL = "https://service.prerender.io";

/**
 * Fetch pre-rendered HTML from Prerender.io
 */
async function fetchPrerenderedContent(url) {
  const prerenderUrl = `${PRERENDER_SERVICE_URL}/${url}`;

  console.log(`[Prerender] Fetching: ${prerenderUrl}`);

  const response = await fetch(prerenderUrl, {
    headers: {
      "X-Prerender-Token": PRERENDER_TOKEN,
      "User-Agent": "Vercel-Prerender-Integration",
    },
  });

  if (!response.ok) {
    throw new Error(`Prerender returned ${response.status}: ${response.statusText}`);
  }

  return await response.text();
}

/**
 * Main handler
 */
export default async function handler(req, res) {
  const { url: targetPath } = req.query;

  if (!targetPath) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Construct full URL
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const fullUrl = `${protocol}://${host}${targetPath}`;

  console.log(`[Prerender] Request for: ${fullUrl}`);
  console.log(`[Prerender] User-Agent: ${req.headers["user-agent"]?.substring(0, 50)}...`);

  try {
    const html = await fetchPrerenderedContent(fullUrl);

    // Set headers
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=7200");
    res.setHeader("X-Prerender-Status", "HIT");

    return res.status(200).send(html);
  } catch (error) {
    console.error("[Prerender] Error:", error.message);

    // On error, redirect to normal SPA
    res.setHeader("X-Prerender-Status", "ERROR");
    return res.redirect(307, targetPath);
  }
}
