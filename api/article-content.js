export default async function handler(req, res) {
  // Leidžiame CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Apdorojame OPTIONS užklausą (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  // Tikriname HTTP metodą
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodas neleidžiamas, naudokite POST' });
    return;
  }
  
  try {
    const { url } = req.body;
    
    // Tikriname ar yra būtini laukai
    if (!url) {
      res.status(400).json({ error: 'Trūksta būtinų parametrų (url)' });
      return;
    }
    
    console.log('Gaunamas straipsnio turinys iš:', url);
    
    // Siunčiame užklausą į originalų straipsnį
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,lt;q=0.8'
      }
    });
    
    // Tikriname atsakymą
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Nepavyko gauti straipsnio turinio: ${response.status}` 
      });
    }
    
    // Gauname straipsnio HTML
    const html = await response.text();
    
    // Pateikiame klientui
    res.status(200).json({ 
      html: html,
      success: true
    });
    
  } catch (error) {
    console.error('Serverio klaida:', error);
    
    res.status(500).json({ 
      error: 'Serverio klaida gaunant straipsnio turinį', 
      details: error.message 
    });
  }
} 