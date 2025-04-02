#!/usr/bin/env node

// RSS Naujienų importavimo komandinis įrankis
// Šis įrankis leidžia paleisti RSS importavimą iš komandinės eilutės

// Skirtas testams ir administravimui
// Pavyzdys:
//   node import-rss.js --rss="https://knowtechie.com/category/ai/feed/" --api-key="YOUR-DEEPL-API-KEY" --limit=2

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Numatytieji parametrai
const defaultParams = {
  rssUrl: 'https://knowtechie.com/category/ai/feed/',
  apiKey: '',
  limit: 1,
  rssProxy: process.env.REACT_APP_RSS_PROXY_URL || '/api/rssfeed',
  translateProxy: process.env.REACT_APP_TRANSLATION_PROXY_URL || '/api/translate'
};

// Argumentų analizė
function parseArgs() {
  const args = process.argv.slice(2);
  const params = { ...defaultParams };

  args.forEach(arg => {
    if (arg.startsWith('--rss=')) {
      params.rssUrl = arg.split('=')[1];
    } else if (arg.startsWith('--api-key=')) {
      params.apiKey = arg.split('=')[1];
    } else if (arg.startsWith('--limit=')) {
      params.limit = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  });

  return params;
}

// Pagalbos žinutė
function printHelp() {
  console.log(`
RSS Naujienų importavimo įrankis

Naudojimas:
  node import-rss.js [parametrai]

Parametrai:
  --rss=URL           RSS šaltinio URL adresas (numatytasis: ${defaultParams.rssUrl})
  --api-key=KEY       DeepL API raktas (privalomas)
  --limit=NUMBER      Maksimalus naujienų kiekis (numatytasis: ${defaultParams.limit})
  --help, -h          Rodyti šią pagalbos žinutę

Aplinkos kintamieji:
  REACT_APP_RSS_PROXY_URL         RSS proxy serverio URL (numatytasis: /api/rssfeed)
  REACT_APP_TRANSLATION_PROXY_URL Vertimo proxy serverio URL (numatytasis: /api/translate)

Pavyzdys:
  node import-rss.js --rss="https://knowtechie.com/category/ai/feed/" --api-key="jūsų-api-raktas" --limit=2
  `);
}

// HTTP užklausos funkcija
async function makeRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url.startsWith('http') ? url : `http://localhost${url}`);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: `${urlObj.pathname}${urlObj.search}`,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(requestOptions, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            if (responseData.trim().startsWith('{') || responseData.trim().startsWith('[')) {
              resolve(JSON.parse(responseData));
            } else {
              resolve(responseData);
            }
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`HTTP klaida: ${res.statusCode} ${res.statusMessage}\n${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    
    req.end();
  });
}

// Pagrindinė funkcija
async function importRssNews() {
  // Surenkame parametrus
  const params = parseArgs();
  
  if (!params.apiKey) {
    console.error("❌ Klaida: DeepL API raktas yra privalomas! Naudokite --api-key parametrą.");
    printHelp();
    process.exit(1);
  }
  
  console.log("=== RSS NAUJIENŲ IMPORTAVIMO ĮRANKIS ===");
  console.log(`RSS šaltinis: ${params.rssUrl}`);
  console.log(`Naujienų limitas: ${params.limit}`);
  console.log(`RSS proxy: ${params.rssProxy}`);
  console.log(`Vertimo proxy: ${params.translateProxy}`);
  
  try {
    // 1. Gauname RSS turinį
    console.log("\n1. Gaunami RSS duomenys...");
    
    const rssUrl = `${params.rssProxy}?url=${encodeURIComponent(params.rssUrl)}`;
    const rssContent = await makeRequest(rssUrl);
    
    if (!rssContent || typeof rssContent !== 'string') {
      throw new Error("Nepavyko gauti tinkamo RSS turinio");
    }
    
    // 2. Analizuojame RSS
    console.log("2. Analizuojami RSS duomenys...");
    
    // Paprastas XML analizės metodas
    const items = [];
    const itemMatches = rssContent.match(/<item>([\s\S]*?)<\/item>/g);
    
    if (!itemMatches) {
      throw new Error("RSS turinyje nerasta <item> elementų");
    }
    
    for (const itemXml of itemMatches) {
      // Ištraukiame pagrindinius elementus
      const title = (itemXml.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const link = (itemXml.match(/<link>(.*?)<\/link>/) || [])[1] || '';
      const pubDate = (itemXml.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      const description = (itemXml.match(/<description>(.*?)<\/description>/) || [])[1] || '';
      
      // Ieškome content:encoded arba turinio alternatyvų
      let content = '';
      const contentMatch = itemXml.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/) || 
                          itemXml.match(/<encoded>([\s\S]*?)<\/encoded>/);
      if (contentMatch) {
        content = contentMatch[1] || '';
      } else {
        content = description; // Jei nėra turinio, naudojame aprašymą
      }
      
      // Ieškome paveikslėlio
      let imageUrl = null;
      if (content) {
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
      }
      
      // Jei nerandame paveikslėlio turinyje, ieškome kituose elementuose
      if (!imageUrl) {
        const mediaMatch = itemXml.match(/<media:content[^>]+url="([^">]+)"/);
        if (mediaMatch && mediaMatch[1]) {
          imageUrl = mediaMatch[1];
        } else {
          const enclosureMatch = itemXml.match(/<enclosure[^>]+url="([^">]+)"/);
          if (enclosureMatch && enclosureMatch[1]) {
            imageUrl = enclosureMatch[1];
          }
        }
      }
      
      items.push({
        title: decodeHtmlEntities(title),
        link: link,
        pubDate: pubDate,
        description: decodeHtmlEntities(description),
        content: content,
        imageUrl: imageUrl
      });
    }
    
    console.log(`RSS analizė baigta. Rasta ${items.length} elementų.`);
    
    // 3. Rūšiuojame pagal datą ir imame tik reikiamą kiekį
    console.log("3. Rūšiuojami ir filtruojami elementai...");
    
    const sortedItems = items.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA; // Nuo naujausių iki seniausių
    });
    
    const itemsToProcess = sortedItems.slice(0, params.limit);
    console.log(`Apdorojimui pasirinkta ${itemsToProcess.length} elementų.`);
    
    // 4. Apdorojame kiekvieną elementą
    console.log("\n4. Pradedamas elementų apdorojimas...");
    
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      console.log(`\nElementas #${i+1}: "${item.title}"`);
      console.log(`Originalus URL: ${item.link}`);
      console.log(`Data: ${item.pubDate}`);
      
      // 5. Verčiame turinį
      console.log("Verčiamas turinys...");
      
      try {
        // Verčiame pavadinimą
        const titleTranslation = await makeRequest(params.translateProxy, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, {
          text: item.title,
          apiKey: params.apiKey,
          source_lang: 'EN',
          target_lang: 'LT'
        });
        
        console.log(`Išverstas pavadinimas: "${titleTranslation.translatedText}"`);
        
        // Verčiame aprašymą
        const descTranslation = await makeRequest(params.translateProxy, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, {
          text: item.description,
          apiKey: params.apiKey,
          source_lang: 'EN',
          target_lang: 'LT'
        });
        
        // Nerodome pilno išversto aprašymo, tik dalį
        const shortDesc = descTranslation.translatedText.substring(0, 50) + 
                          (descTranslation.translatedText.length > 50 ? '...' : '');
        console.log(`Išverstas aprašymas: "${shortDesc}"`);
        
        // Turinio vertimas yra sudėtingesnis, todėl tik pranešame apie veiksmą
        console.log("Verčiamas straipsnio turinys (tai gali užtrukti)...");
        
        const contentTranslation = await makeRequest(params.translateProxy, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, {
          text: item.content,
          apiKey: params.apiKey,
          source_lang: 'EN',
          target_lang: 'LT'
        });
        
        console.log(`Turinys sėkmingai išverstas (${Math.round(contentTranslation.translatedText.length / 1024)}KB).`);
        
        // 6. Čia būtų paveikslėlio apdorojimas ir naujienos įrašymas į duomenų bazę
        // Šioje komandinio įrankio versijoje tai neįgyvendinta
        
        if (item.imageUrl) {
          console.log(`Rastas paveikslėlis: ${item.imageUrl}`);
          console.log(`Šioje komandinio įrankio versijoje paveikslėliai nėra apdorojami.`);
        } else {
          console.log("Paveikslėlis nerastas.");
        }
        
        console.log(`\nElementas #${i+1} sėkmingai apdorotas.`);
        console.log("Pastaba: Duomenų įrašymas į duomenų bazę neįgyvendintas šioje komandinio įrankio versijoje.");
        
      } catch (error) {
        console.error(`❌ Klaida apdorojant elementą #${i+1}:`, error.message);
      }
    }
    
    console.log("\n=== RSS IMPORTAVIMAS BAIGTAS ===");
    console.log(`Apdorota elementų: ${itemsToProcess.length}`);
    console.log("Visos operacijos baigtos.");
    
  } catch (error) {
    console.error("\n❌ Klaida importuojant RSS naujienas:", error.message);
    process.exit(1);
  }
}

// HTML esybių dekodavimas
function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Paleidžiame pagrindinę funkciją
importRssNews().catch(error => {
  console.error("Kritinė klaida:", error);
  process.exit(1);
}); 