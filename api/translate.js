export default async function handler(req, res) {
  // Leidžiame CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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
    const { text, apiKey, sourceLang = 'EN', targetLang = 'LT' } = req.body;
    
    // Tikriname ar yra būtini laukai
    if (!text) {
      res.status(400).json({ error: 'Trūksta būtinų parametrų (text)' });
      return;
    }
    
    // Naudojame aplinkos kintamąjį DeepL API raktui jei nėra pateiktas
    const deepLApiKey = apiKey || process.env.DEEPL_API_KEY;
    
    if (!deepLApiKey) {
      res.status(400).json({ error: 'Trūksta API rakto' });
      return;
    }
    
    console.log('Verčiama:', text.substring(0, 50) + '...');
    
    // Siunčiame užklausą į DeepL API
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${deepLApiKey}`
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
    const translatedText = data.translations?.[0]?.text || text;
    
    console.log('Išversta:', translatedText.substring(0, 50) + '...');
    
    // Išsaugome statistiką apie vertimą (jei yra prisijungęs vartotojas)
    if (process.env.VERCEL_ENV === 'production') {
      try {
        // Čia galite pridėti kodą, kuris įrašo vertimo statistiką į duomenų bazę
        console.log('Vertimo statistika įrašyta');
      } catch (statError) {
        console.error('Nepavyko įrašyti statistikos:', statError);
      }
    }
    
    res.status(200).json({ 
      translatedText: translatedText,
      success: true
    });
    
  } catch (error) {
    console.error('Serverio klaida:', error);
    
    res.status(500).json({ 
      error: 'Serverio klaida apdorojant užklausą', 
      details: error.message 
    });
  }
} 