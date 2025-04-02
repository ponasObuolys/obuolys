// RSS Feed Proxy serveris Vercel platformai
// Ši funkcija naudojama kaip alternatyva Supabase Edge funkcijai

export default async function handler(req, res) {
  // Nustatome CORS antraštes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  
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
    
    // Siunčiame užklausą į RSS šaltinį
    console.log(`Siunčiama užklausa į RSS šaltinį: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      }
    });
    
    // Tikriname atsakymą iš RSS šaltinio
    if (!response.ok) {
      const errorText = await response.text();
      console.error('RSS šaltinio klaida:', response.status, errorText);
      
      res.status(response.status).json({ 
        error: 'Klaida kreipiantis į RSS šaltinį', 
        status: response.status,
        details: errorText
      });
      return;
    }
    
    // Perskaitome ir grąžiname RSS turinį
    const rssContent = await response.text();
    res.status(200).send(rssContent);
    
  } catch (error) {
    console.error('Serverio klaida:', error);
    res.status(500).json({ error: 'Serverio klaida apdorojant užklausą', details: error.message });
  }
} 