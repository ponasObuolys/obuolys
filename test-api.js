// Test-API - RSS ir DeepL proxy serverių testavimo įrankis
// Šis skriptas padeda patikrinti, ar teisingai sukonfigūruoti aplinkos kintamieji ir ar proxy serveriai veikia

async function testApiEndpoints() {
  console.log("=== RSS IR DEEPL PROXY TESTAVIMO ĮRANKIS ===");
  console.log("Tikrinami aplinkos kintamieji...");
  
  const rssProxyUrl = process.env.REACT_APP_RSS_PROXY_URL || "/api/rssfeed";
  const translationProxyUrl = process.env.REACT_APP_TRANSLATION_PROXY_URL || "/api/translate";
  const testRssUrl = "https://knowtechie.com/category/ai/feed/";
  
  console.log(`RSS Proxy URL: ${rssProxyUrl}`);
  console.log(`Translation Proxy URL: ${translationProxyUrl}`);
  
  // 1. Testuojame RSS proxy
  console.log("\n1. Testuojame RSS Proxy serverį:");
  console.log(`Bandoma gauti RSS iš: ${testRssUrl}`);
  
  try {
    const rssResponse = await fetch(`${rssProxyUrl}?url=${encodeURIComponent(testRssUrl)}`);
    
    if (!rssResponse.ok) {
      throw new Error(`HTTP klaida: ${rssResponse.status} ${rssResponse.statusText}`);
    }
    
    const rssText = await rssResponse.text();
    console.log(`✅ RSS Proxy veikia! Gauta ${Math.round(rssText.length / 1024)}KB duomenų.`);
    
    // Patikriname, ar gautas XML yra validus RSS
    if (rssText.includes("<rss") || rssText.includes("<feed")) {
      console.log("✅ Gautas validus RSS/Atom turinys.");
    } else {
      console.log("⚠️ Gautas atsakymas neatrodo kaip validus RSS/Atom. Patikrinkite atsakymo turinį.");
    }
  } catch (error) {
    console.error(`❌ RSS Proxy klaida: ${error.message}`);
    console.log("Patikrinkite, ar RSS proxy serveris veikia ir ar teisingas aplinkos kintamasis REACT_APP_RSS_PROXY_URL.");
  }
  
  // 2. Testuojame DeepL proxy
  console.log("\n2. Testuojame Vertimo Proxy serverį:");
  console.log("Bandoma išversti testinį tekstą...");
  
  try {
    // Jūsų DeepL API raktas turėtų būti saugiai perduodamas, čia naudojame testinį
    const testApiKey = "YOUR-DEEPL-API-KEY"; // Pakeiskite šį raktą savo tikru DeepL API raktu
    
    const translateResponse = await fetch(translationProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "Hello world! This is a test of the translation system.",
        apiKey: testApiKey,
        source_lang: 'EN',
        target_lang: 'LT',
      }),
    });
    
    if (!translateResponse.ok) {
      const errorData = await translateResponse.json().catch(() => null);
      throw new Error(`HTTP klaida: ${translateResponse.status} ${translateResponse.statusText}. ${errorData?.error || ''}`);
    }
    
    const translateResult = await translateResponse.json();
    console.log(`✅ Vertimo Proxy veikia! Rezultatas: "${translateResult.translatedText}"`);
    
    if (translateResult.translatedText.includes("Labas") || 
        translateResult.translatedText.includes("Sveikas") || 
        translateResult.translatedText.includes("pasauli")) {
      console.log("✅ Vertimas atrodo teisingas (lietuvių kalba).");
    } else {
      console.log("⚠️ Vertimo rezultatas neatrodo kaip lietuvių kalba. Patikrinkite DeepL API raktą ir konfigūraciją.");
    }
  } catch (error) {
    console.error(`❌ Vertimo Proxy klaida: ${error.message}`);
    console.log("Patikrinkite, ar Vertimo proxy serveris veikia ir ar teisingas aplinkos kintamasis REACT_APP_TRANSLATION_PROXY_URL.");
    console.log("Taip pat įsitikinkite, kad DeepL API raktas yra teisingas ir galiojantis.");
  }
  
  console.log("\n=== TESTAVIMAS BAIGTAS ===");
  console.log("Jei abu testai sėkmingi, jūsų proxy serverių konfigūracija veikia tinkamai!");
  console.log("Jei kažkuris testas nepavyko, patikrinkite klaidos pranešimus ir atitinkamą proxy serverio konfigūraciją.");
}

// Paleisti testą
testApiEndpoints().catch(error => {
  console.error("Testavimo klaida:", error);
});

// Kaip naudoti:
// 1. Įsitikinkite, kad serverių aplinkos kintamieji nustatyti teisingai
// 2. Paleiskite skriptą su komanda: node test-api.js
// 3. Pakeiskite "YOUR-DEEPL-API-KEY" į jūsų tikrą DeepL API raktą 