// DeepL API proxy funkcija
// Ši funkcija veikia kaip tarpininkas tarp kliento ir DeepL API

// @ts-ignore - Deno API importas
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface RequestBody {
  text: string;
  apiKey: string;
  sourceLang?: string;
  targetLang?: string;
}

serve(async (req) => {
  // Leidžiame CORS
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  });

  // Apdorojame OPTIONS užklausą (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Tikriname HTTP metodą
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Metodas neleidžiamas, naudokite POST' }),
        { headers, status: 405 }
      );
    }

    // Perskaitome užklausos kūną
    const reqData: RequestBody = await req.json();
    
    // Tikriname ar yra būtini laukai
    if (!reqData.text || !reqData.apiKey) {
      return new Response(
        JSON.stringify({ error: 'Trūksta būtinų parametrų (text, apiKey)' }),
        { headers, status: 400 }
      );
    }

    // Nustatome kalbas
    const sourceLang = reqData.sourceLang || 'EN';
    const targetLang = reqData.targetLang || 'LT';

    // Siunčiame užklausą į DeepL API
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${reqData.apiKey}`
      },
      body: JSON.stringify({
        text: [reqData.text],
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
      
      return new Response(
        JSON.stringify({ 
          error: 'Klaida kreipiantis į DeepL API', 
          status: response.status,
          details: errorText
        }),
        { headers, status: response.status }
      );
    }

    // Perskaitome ir grąžiname atsakymą
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        translatedText: data.translations?.[0]?.text || reqData.text,
        success: true
      }),
      { headers, status: 200 }
    );

  } catch (error) {
    console.error('Serverio klaida:', error);
    
    return new Response(
      JSON.stringify({ error: 'Serverio klaida apdorojant užklausą', details: error.message }),
      { headers, status: 500 }
    );
  }
}); 