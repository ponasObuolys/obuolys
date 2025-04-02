// DeepL API Proxy serveris Vercel platformai
// Ši funkcija naudojama kaip alternatyva Supabase Edge funkcijai

export default async function handler(req, res) {
  // Nustatome CORS antraštes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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
    
    // Gauname vertimo parametrus iš užklausos kūno
    const { text, apiKey, source_lang = 'EN', target_lang = 'LT' } = req.body;
    
    if (!text) {
      res.status(400).json({ error: 'Trūksta teksto vertimui' });
      return;
    }
    
    if (!apiKey) {
      res.status(400).json({ error: 'Trūksta DeepL API rakto' });
      return;
    }
    
    // Perskirstome tekstą į segmentus, jei jis per ilgas
    // DeepL API leidžia versti maks. ~130 000 simbolių vienu kartu
    const textSegments = splitTextIntoSegments(text, 100000);
    const translatedSegments = [];
    
    console.log(`[Translate Proxy] Verčiama ${textSegments.length} teksto segmentai (viso ${text.length} simbolių)`);
    
    // Verčiame kiekvieną segmentą atskirai
    for (const segment of textSegments) {
      const translateResponse = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [segment],
          source_lang: source_lang,
          target_lang: target_lang,
          tag_handling: 'html',
          preserve_formatting: true,
          // Galimos papildomos opcijos pagal DeepL API: 
          // formality: 'default', // 'less' arba 'more'
          // split_sentences: '1',
        }),
      });
      
      if (!translateResponse.ok) {
        const errorData = await translateResponse.json().catch(() => translateResponse.text());
        const errorStatus = translateResponse.status;
        
        console.error(`[Translate Proxy] DeepL API klaida (${errorStatus}):`, errorData);
        
        let errorMessage = 'Klaida verčiant tekstą';
        
        // Specifiniai klaidų pranešimai pagal DeepL API klaidų kodus
        if (errorStatus === 403) {
          errorMessage = 'Neteisingas arba negaliojantis DeepL API raktas';
        } else if (errorStatus === 429) {
          errorMessage = 'Viršytas DeepL API užklausų limitas (500,000 simbolių per mėnesį nemokamame plane)';
        } else if (errorStatus === 456) {
          errorMessage = 'Per daug teksto vertimui vienu kartu';
        } else if (errorStatus === 400) {
          errorMessage = 'Bloga užklausa: galimai neteisingi vertimo parametrai';
        }
        
        res.status(errorStatus).json({ 
          error: errorMessage,
          details: typeof errorData === 'object' ? errorData : { message: String(errorData) }
        });
        return;
      }
      
      const translateResult = await translateResponse.json();
      const translatedText = translateResult.translations[0].text;
      translatedSegments.push(translatedText);
    }
    
    // Sujungiame visus išverstus segmentus
    const fullTranslatedText = translatedSegments.join('');
    console.log(`[Translate Proxy] Sėkmingai išversta į ${target_lang} kalbą (${fullTranslatedText.length} simboliai)`);
    
    // Grąžiname išverstą tekstą
    res.status(200).json({ 
      translatedText: fullTranslatedText,
      sourceLanguage: source_lang,
      targetLanguage: target_lang
    });
  
  } catch (error) {
    console.error('[Translate Proxy] Serverio klaida:', error.message);
    
    res.status(500).json({ 
      error: 'Serverio klaida apdorojant vertimo užklausą', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Funkcija teksto skaidymui į segmentus
function splitTextIntoSegments(text, maxSegmentLength = 100000) {
  if (text.length <= maxSegmentLength) {
    return [text];
  }
  
  const segments = [];
  let remainingText = text;
  
  while (remainingText.length > 0) {
    let segmentEndIndex = maxSegmentLength;
    
    // Jei turime HTML, bandome skaidyti ties HTML elementų ribomis
    if (remainingText.includes('<') && remainingText.includes('>')) {
      if (segmentEndIndex < remainingText.length) {
        // Ieškome artimiausio pilno HTML elemento
        let tempIndex = remainingText.lastIndexOf('>', segmentEndIndex);
        if (tempIndex > 0) {
          segmentEndIndex = tempIndex + 1;
        } else {
          // Jei nerandame, naudojame standartinį ilgį
          segmentEndIndex = maxSegmentLength;
        }
      }
    }
    
    // Apkerpame segmentą iki nurodyto dydžio
    const segment = remainingText.substring(0, Math.min(segmentEndIndex, remainingText.length));
    segments.push(segment);
    
    // Atnaujiname likusį tekstą
    remainingText = remainingText.substring(segment.length);
  }
  
  return segments;
} 