export default async function handler(req, res) {
  // Leidžiame CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Apdorojame OPTIONS užklausą (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  // Tikriname HTTP metodą
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Metodas neleidžiamas, naudokite GET' });
    return;
  }
  
  try {
    const { url } = req.query;
    
    // Tikriname ar yra būtini parametrai
    if (!url) {
      res.status(400).json({ error: 'Trūksta būtinų parametrų (url)' });
      return;
    }
    
    console.log('Parsiunčiamas paveikslėlis iš:', url);
    
    // Siunčiame užklausą į originalų paveikslėlį
    const imageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.tomsguide.com/', // Simuliuojame, kad atėjome iš originalios svetainės
        'Accept-Language': 'en-US,en;q=0.9,lt;q=0.8'
      }
    });
    
    // Tikriname atsakymą
    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ 
        error: `Nepavyko gauti paveikslėlio: ${imageResponse.status}` 
      });
    }
    
    // Gauname paveikslėlio buferį ir informaciją apie tipą
    const buffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Nustatome atsakymo antraštes
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Caching 24h
    
    // Siunčiame paveikslėlį klientui
    res.status(200).send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('Serverio klaida:', error);
    
    res.status(500).json({ 
      error: 'Serverio klaida parsiunčiant paveikslėlį', 
      details: error.message 
    });
  }
} 