import { supabase } from "@/integrations/supabase/client";

interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content: string;
  imageUrl?: string;
}

/**
 * Paslauga atsakinga už RSS naujienų gavimą, vertimą ir išsaugojimą.
 */
export class RssFeedService {
  private rssUrl: string;
  private translationApiKey: string;
  private maxNewsPerDay: number;

  constructor(rssUrl: string, translationApiKey: string, maxNewsPerDay: number = 1) {
    this.rssUrl = rssUrl;
    this.translationApiKey = translationApiKey;
    this.maxNewsPerDay = maxNewsPerDay;
  }

  /**
   * Gauna naujienas iš RSS šaltinio
   */
  public async fetchRssItems(): Promise<RssItem[]> {
    try {
      // Tikriname, ar yra sukonfigūruotas RSS proxy URL
      const rssProxyUrl = process.env.REACT_APP_RSS_PROXY_URL;
      let url = this.rssUrl;
      
      // Jei yra proxy URL, jį naudojame
      if (rssProxyUrl) {
        console.log('Naudojamas proxy serveris RSS šaltiniui');
        url = `${rssProxyUrl}?url=${encodeURIComponent(this.rssUrl)}`;
      } else {
        console.log('Tiesioginis kreipimasis į RSS šaltinį');
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Klaida gaunant RSS: ${response.status} ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const items = Array.from(xmlDoc.querySelectorAll("item"));
      
      return items.map(item => {
        // Ištraukiame paveikslėlio URL iš turinio
        let imageUrl: string | undefined;
        const contentEncoded = item.querySelector("content\\:encoded")?.textContent || 
                              item.querySelector("encoded")?.textContent || 
                              "";
        
        if (contentEncoded) {
          const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1];
          }
        }

        // Ištraukiame nuorodą į paveikslėlį iš media:content arba enclosure tag
        if (!imageUrl) {
          const mediaContent = item.querySelector("media\\:content");
          if (mediaContent && mediaContent.getAttribute("url")) {
            imageUrl = mediaContent.getAttribute("url") || undefined;
          }
        }

        if (!imageUrl) {
          const enclosure = item.querySelector("enclosure");
          if (enclosure && enclosure.getAttribute("url")) {
            imageUrl = enclosure.getAttribute("url") || undefined;
          }
        }
        
        return {
          title: item.querySelector("title")?.textContent || "",
          description: item.querySelector("description")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          content: contentEncoded,
          imageUrl
        };
      });
    } catch (error) {
      console.error("Klaida gaunant RSS naujienas:", error);
      return [];
    }
  }

  /**
   * Verčia tekstą naudojant DeepL API
   */
  private async translateText(text: string): Promise<string> {
    try {
      // Jei tekstas tuščias, grąžiname jį nepakeitę
      if (!text || text.trim() === '') {
        console.log('Tekstas tuščias, nereikia versti');
        return text;
      }

      // Bandome naudoti tarpinį serverį (proxy), jeigu jis sukonfigūruotas
      // Šis URL turėtų būti pakeistas į realų jūsų serverio proxy endpoint
      const proxyUrl = process.env.REACT_APP_TRANSLATION_PROXY_URL || '';
      
      if (proxyUrl) {
        console.log('Naudojamas proxy serveris vertimui');
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            apiKey: this.translationApiKey,
            sourceLang: 'EN',
            targetLang: 'LT',
          }),
        });

        if (!response.ok) {
          throw new Error(`Proxy serverio klaida: ${response.status}`);
        }

        const data = await response.json();
        return data.translatedText || text;
      }
      
      // Jei proxy nėra, bandome tiesioginį API iškvietimą su no-cors režimu
      // Pastaba: no-cors režimas neleidžia perskaityti atsakymo, todėl šis metodas veiks tik
      // jei DeepL API palaiko JSONP ar kitus cross-origin sprendimus
      console.log('Bandoma tiesiogiai kreiptis į DeepL API');
      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: 'POST',
        mode: 'no-cors', // Pridedame no-cors režimą
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `DeepL-Auth-Key ${this.translationApiKey}`
        },
        body: JSON.stringify({
          text: [text],
          source_lang: 'EN',
          target_lang: 'LT',
          tag_handling: 'html',
          preserve_formatting: true
        }),
      });
      
      // SVARBU: naudojant 'no-cors' režimą, mes negalėsime perskaityti atsakymo duomenų
      // Šis kodas gali neveikti kaip tikimasi - čia reikia serverio pusės sprendimo
      
      // Apsauginis mechanizmas - jei DeepL API nepasiekiamas, grąžiname neišverstą tekstą
      if (!response.ok && response.status !== 0) { // status 0 yra įprasta no-cors režimu
        throw new Error(`DeepL API klaida: ${response.status}`);
      }
      
      try {
        const data = await response.json();
        return data?.translations?.[0]?.text || text;
      } catch (e) {
        console.warn('Nepavyko apdoroti atsakymo dėl CORS apribojimų - reikalingas proxy serveris');
        
        // Grąžiname originalų tekstą su perspėjimu
        return text + ' [Vertimas nepavyko dėl CORS apribojimų]';
      }
      
    } catch (error) {
      console.error('Klaida verčiant tekstą su DeepL:', error);
      
      // Grąžiname originalų tekstą klaidos atveju
      return text;
    }
  }

  /**
   * Parsiunčia paveikslėlį ir įkelia į Supabase saugyklą
   */
  private async uploadImage(url: string, itemTitle: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Sukuriame failą su saugiu pavadinimu
      const fileName = `${Date.now()}-${itemTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${blob.type.split('/')[1] || 'jpg'}`;
      const filePath = `news/covers/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('site-images')
        .upload(filePath, blob);
      
      if (error) {
        throw error;
      }
      
      // Gauname viešą URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Klaida įkeliant paveikslėlį:", error);
      return null;
    }
  }

  /**
   * Sukuria naują naujienos įrašą Supabase duomenų bazėje
   */
  private async createNewsItem(item: RssItem, translatedTitle: string, translatedDescription: string, translatedContent: string, imageUrl: string | null): Promise<boolean> {
    try {
      const slug = this.generateSlug(translatedTitle);
      const date = new Date(item.pubDate).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('news')
        .insert({
          title: translatedTitle,
          description: translatedDescription,
          content: translatedContent,
          slug: slug,
          date: date,
          author: "RSS",
          published: true,
          image_url: imageUrl
        });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Klaida kuriant naujienos įrašą:", error);
      return false;
    }
  }

  /**
   * Generuoja slug iš pavadinimo
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Pašalina visus specialius simbolius
      .replace(/\s+/g, '-') // Pakeičia tarpus brūkšneliais
      .replace(/-+/g, '-') // Pašalina pasikartojančius brūkšnelius
      .trim(); // Pašalina tarpus pradžioje ir pabaigoje
  }

  /**
   * Patikrina, ar naujiena jau egzistuoja pagal originalų URL
   */
  private async newsExists(originalUrl: string): Promise<boolean> {
    try {
      // Patikrinti pagal nuorodą turinyje
      const { data, error } = await supabase
        .from('news')
        .select('id')
        .like('content', `%${originalUrl}%`)
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      return data.length > 0;
    } catch (error) {
      console.error("Klaida tikrinant naujienos egzistavimą:", error);
      return false;
    }
  }

  /**
   * Patikrina, kiek naujienų jau buvo importuota šiandien
   */
  private async getNewsCountForToday(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0]; // Gaunamas formatas YYYY-MM-DD
      
      const { data, error, count } = await supabase
        .from('news')
        .select('id', { count: 'exact' })
        .eq('author', 'RSS')
        .eq('date', today);
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error("Klaida tikrinant šiandienos naujienų kiekį:", error);
      return 0;
    }
  }

  /**
   * Pagrindinis metodas, kuris atlieka visą procesą - nuo naujienų gavimo iki jų išsaugojimo
   */
  public async processRssFeeds(): Promise<void> {
    try {
      // Patikriname, kiek naujienų jau buvo importuota šiandien
      const todayNewsCount = await this.getNewsCountForToday();
      
      // Jei jau pasiektas limitas, stabdome procesą
      if (todayNewsCount >= this.maxNewsPerDay) {
        console.log(`Šiandien jau importuota ${todayNewsCount} naujiena(-os). Limitas: ${this.maxNewsPerDay} per dieną.`);
        return;
      }
      
      // Kiek naujienų dar galime importuoti šiandien
      const remainingNewsToday = this.maxNewsPerDay - todayNewsCount;
      console.log(`Galima importuoti dar ${remainingNewsToday} naujieną(-as) šiandien.`);
      
      const items = await this.fetchRssItems();
      
      // Rūšiuojame naujienas pagal publikavimo datą, pradedant nuo naujausių
      const sortedItems = items.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      });
      
      // Ribojame apdorojamų naujienų kiekį pagal likusį dienos limitą
      const itemsToProcess = sortedItems.slice(0, remainingNewsToday);
      
      let importedCount = 0;
      
      for (const item of itemsToProcess) {
        // Patikrinti, ar naujiena jau egzistuoja
        const exists = await this.newsExists(item.link);
        if (exists) {
          console.log(`Naujiena "${item.title}" jau egzistuoja. Praleista.`);
          continue;
        }
        
        // Verčiame turinį
        const translatedTitle = await this.translateText(item.title);
        const translatedDescription = await this.translateText(item.description);
        const translatedContent = await this.translateText(item.content);
        
        // Įkeliame paveikslėlį, jei jis yra
        let imageUrl: string | null = null;
        if (item.imageUrl) {
          imageUrl = await this.uploadImage(item.imageUrl, item.title);
        }
        
        // Įkelti originalią nuorodą į turinį
        const contentWithSource = `${translatedContent}<p><br><em>Šaltinis: <a href="${item.link}" target="_blank">${item.link}</a></em></p>`;
        
        // Kuriame naujienos įrašą
        const created = await this.createNewsItem(item, translatedTitle, translatedDescription, contentWithSource, imageUrl);
        
        if (created) {
          console.log(`Naujiena "${translatedTitle}" sėkmingai pridėta.`);
          importedCount++;
        }
        
        // Jei pasiekėme dienos limitą, nutraukiame ciklą
        if (importedCount >= remainingNewsToday) {
          console.log(`Pasiektas dienos limitas (${this.maxNewsPerDay} naujienos per dieną).`);
          break;
        }
      }
      
      console.log(`Importuota ${importedCount} nauja(-os) naujiena(-os). Viso šiandien: ${todayNewsCount + importedCount}/${this.maxNewsPerDay}.`);
      
    } catch (error) {
      console.error("Klaida apdorojant RSS srautus:", error);
    }
  }
} 