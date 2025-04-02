// RSS Feed proxy funkcija
// Ši funkcija veikia kaip tarpininkas RSS šaltiniui, apeinant CORS apribojimus

// @ts-ignore - Deno API importas
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  // Leidžiame CORS
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/xml; charset=utf-8',
  });

  // Apdorojame OPTIONS užklausą (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Tikriname HTTP metodą
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Metodas neleidžiamas, naudokite GET' }),
        { headers: new Headers({ 'Content-Type': 'application/json' }), status: 405 }
      );
    }

    // Gauname RSS URL iš užklausos parametrų
    const url = new URL(req.url);
    const rssUrl = url.searchParams.get('url');

    if (!rssUrl) {
      return new Response(
        JSON.stringify({ error: 'Trūksta URL parametro' }),
        { headers: new Headers({ 'Content-Type': 'application/json' }), status: 400 }
      );
    }

    // Siunčiame užklausą į RSS šaltinį
    console.log(`Siunčiama užklausa į RSS šaltinį: ${rssUrl}`);
    const response = await fetch(rssUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      }
    });

    // Tikriname atsakymą iš RSS šaltinio
    if (!response.ok) {
      const errorText = await response.text();
      console.error('RSS šaltinio klaida:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Klaida kreipiantis į RSS šaltinį', 
          status: response.status,
          details: errorText
        }),
        { headers: new Headers({ 'Content-Type': 'application/json' }), status: response.status }
      );
    }

    // Perskaitome ir grąžiname atsakymą
    const rssContent = await response.text();
    
    return new Response(rssContent, { 
      headers,
      status: 200 
    });

  } catch (error) {
    console.error('Serverio klaida:', error);
    
    return new Response(
      JSON.stringify({ error: 'Serverio klaida apdorojant užklausą', details: error.message }),
      { headers: new Headers({ 'Content-Type': 'application/json' }), status: 500 }
    );
  }
}); 