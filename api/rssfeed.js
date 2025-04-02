// RSS Feed Proxy serveris Vercel platformai
// Ši funkcija naudojama kaip alternatyva Supabase Edge funkcijai

export default async function handler(req, res) {
  // Nustatome CORS antraštes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Apdorojame OPTIONS užklausą (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  try {
    // Tikriname HTTP metodą
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Metodas neleidžiamas, naudokite GET' });
      return;
    }
    
    // Gauname RSS URL iš užklausos parametrų
    const { url } = req.query;
    
    if (!url) {
      res.status(400).json({ error: 'Trūksta URL parametro' });
      return;
    }

    console.log(`[RSS Proxy] Siunčiama užklausa į: ${url}`);
    
    // Siunčiame užklausą į RSS šaltinį su išsamiomis antraštėmis
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
        'Accept-Language': 'en-US,en;q=0.9,lt;q=0.8',
        'Referer': process.env.VERCEL_URL || 'https://www.ponasobuolys.lt/',
        'Cache-Control': 'no-cache'
      },
      redirect: 'follow',
      cache: 'no-store'
    });
    
    // Tikriname atsakymą iš RSS šaltinio
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[RSS Proxy] Klaida (${response.status}): ${errorText.substring(0, 150)}...`);
      
      res.status(response.status).json({ 
        error: 'Klaida kreipiantis į RSS šaltinį', 
        status: response.status,
        details: errorText.substring(0, 500) // Apribojame dydį
      });
      return;
    }
    
    // Gauname antraštes iš atsakymo
    const contentType = response.headers.get('Content-Type') || 'application/xml; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    
    // Perskaitome ir grąžiname RSS turinį
    const rssContent = await response.text();
    console.log(`[RSS Proxy] Sėkmingai gautas turinys (${Math.round(rssContent.length / 1024)} KB)`);
    
    // Siunčiame atsakymą klientui
    res.status(200).send(rssContent);
    
  } catch (error) {
    console.error('[RSS Proxy] Serverio klaida:', error.message);
    
    res.status(500).json({ 
      error: 'Serverio klaida apdorojant užklausą', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 