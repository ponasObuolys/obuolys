// DeepL API Proxy serveris Vercel platformai
// Ši funkcija naudojama kaip alternatyva Supabase Edge funkcijai

export default async function handler(req, res) {
  // Nustatome CORS antraštes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Apdorojame OPTIONS užklausą (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  try {
    // Tikriname HTTP metodą
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Metodas neleidžiamas, naudokite POST' });
      return;
    }
    
    // Perskaitome užklausos kūną
    const { text, apiKey, sourceLang = 'EN', targetLang = 'LT' } = req.body;
    
    // Tikriname ar yra būtini laukai
    if (!text || !apiKey) {
      res.status(400).json({ error: 'Trūksta būtinų parametrų (text, apiKey)' });
      return;
    }
    
    // Siunčiame užklausą į DeepL API
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${apiKey}`
      },
      body: JSON.stringify({
        text: [text],
        source_lang: sourceLang,
        target_lang: targetLang,
        tag_handling: 'html',
        preserve_formatting: true
      }),
    });
    
    // Tikriname atsakymą iš DeepL API
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepL API klaida:', response.status, errorText);
      
      res.status(response.status).json({ 
        error: 'Klaida kreipiantis į DeepL API', 
        status: response.status,
        details: errorText
      });
      return;
    }
    
    // Perskaitome ir grąžiname atsakymą
    const data = await response.json();
    
    res.status(200).json({ 
      translatedText: data.translations?.[0]?.text || text,
      success: true
    });
    
  } catch (error) {
    console.error('Serverio klaida:', error);
    res.status(500).json({ error: 'Serverio klaida apdorojant užklausą', details: error.message });
  }
} 