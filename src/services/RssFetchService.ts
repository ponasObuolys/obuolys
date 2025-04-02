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
      
      if (rssProxyUrl) {
        console.log(`Naudojamas RSS proxy serveris: ${rssProxyUrl}`);
        const url = `${rssProxyUrl}?url=${encodeURIComponent(this.rssUrl)}`;
        
        // Siunčiame užklausą per proxy
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Nepavyko nuskaityti klaidos teksto');
          console.error(`RSS proxy serverio klaida: ${response.status}`, errorText);
          throw new Error(`Klaida gaunant RSS per proxy: ${response.status} ${response.statusText}`);
        }
        
        const xmlText = await response.text();
        console.log(`Gauta RSS duomenų: ${Math.round(xmlText.length / 1024)} KB`);
        return this.parseRssXml(xmlText);
      } else {
        console.log('Nėra sukonfigūruoto RSS proxy serverio. Tiesioginis kreipimasis gali būti blokuojamas dėl CORS');
        
        try {
          // Bandome tiesioginę užklausą su papildomomis antraštėmis
          const response = await fetch(this.rssUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
              'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Tiesioginio kreipimosi klaida: ${response.status} ${response.statusText}`);
          }
          
          const xmlText = await response.text();
          return this.parseRssXml(xmlText);
        } catch (error) {
          console.error('Tiesioginis RSS gavimas nepavyko:', error);
          throw new Error(
            'RSS gavimas nepavyko dėl CORS apribojimų. ' +
            'Sukonfigūruokite proxy serverį aplinkos kintamajame REACT_APP_RSS_PROXY_URL. ' +
            'Daugiau informacijos rasite README.md ir RSS_INFO.md dokumentuose.'
          );
        }
      }
    } catch (error) {
      console.error("Klaida gaunant RSS naujienas:", error);
      return [];
    }
  }
  
  /**
   * Analizuoja RSS XML tekstą ir paverčia į RssItem masyvą
   */
  private parseRssXml(xmlText: string): RssItem[] {
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
      const proxyUrl = process.env.REACT_APP_TRANSLATION_PROXY_URL;
      
      if (proxyUrl) {
        console.log(`Naudojamas vertimo proxy serveris: ${proxyUrl}`);
        
        // Didelius tekstus suskirstome į mažesnes dalis, kad išvengtume užklausos dydžio apribojimų
        const textLength = text.length;
        
        if (textLength > 100000) {
          console.log(`Tekstas per didelis (${textLength} simbolių), suskirstome į dalis`);
          // Vertimui suskirstome tekstą į mažesnes dalis logikos lygmenyje
          const textParts = [];
          for (let i = 0; i < text.length; i += 95000) {
            textParts.push(text.substring(i, i + 95000));
          }
          
          // Verčiame kiekvieną dalį atskirai
          const translatedParts = await Promise.all(
            textParts.map(async (part) => {
              return this.translateTextPart(part, proxyUrl);
            })
          );
          
          // Sujungiame išverstas dalis
          return translatedParts.join('');
        } else {
          return await this.translateTextPart(text, proxyUrl);
        }
      } else {
        console.warn('Nėra sukonfigūruoto vertimo proxy serverio. Vertimas nebus atliktas.');
        return text + ' [Vertimas negalimas - nėra sukonfigūruoto proxy serverio]';
      }
    } catch (error) {
      console.error('Klaida verčiant tekstą:', error);
      // Grąžiname originalų tekstą klaidos atveju
      return text;
    }
  }

  /**
   * Pagalbinė funkcija vienos teksto dalies vertimui
   */
  private async translateTextPart(text: string, proxyUrl: string): Promise<string> {
    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          apiKey: this.translationApiKey,
          source_lang: 'EN',
          target_lang: 'LT',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Vertimo serverio klaida (${response.status}): ${errorData?.error || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.translatedText) {
        console.warn('Vertimo atsakymas neturi translatedText lauko:', data);
        return text;
      }
      
      return data.translatedText;
    } catch (error) {
      console.error('Klaida verčiant teksto dalį:', error);
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
      console.log('Pradedamas RSS naujienų apdorojimas...');
      console.log(`RSS šaltinis: ${this.rssUrl}`);
      
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
      
      // Gauname RSS elementus
      console.log('Gaunami RSS elementai...');
      const items = await this.fetchRssItems();
      console.log(`Gauta ${items.length} RSS elementų`);
      
      if (items.length === 0) {
        console.log('Nerasta naujienų RSS šaltinyje arba nepavyko gauti duomenų.');
        return;
      }
      
      // Rūšiuojame naujienas pagal publikavimo datą, pradedant nuo naujausių
      const sortedItems = items.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      });
      
      // Ribojame apdorojamų naujienų kiekį pagal likusį dienos limitą
      const itemsToProcess = sortedItems.slice(0, remainingNewsToday);
      console.log(`Apdorojama ${itemsToProcess.length} naujausia(-os) naujiena(-os) iš ${items.length} rastų`);
      
      let importedCount = 0;
      
      for (const item of itemsToProcess) {
        console.log(`Apdorojama naujiena: "${item.title.substring(0, 50)}..."`);
        
        // Patikrinti, ar naujiena jau egzistuoja
        const exists = await this.newsExists(item.link);
        if (exists) {
          console.log(`Naujiena "${item.title.substring(0, 50)}..." jau egzistuoja. Praleista.`);
          continue;
        }
        
        // Verčiame turinį
        console.log('Verčiamas turinys...');
        const translatedTitle = await this.translateText(item.title);
        const translatedDescription = await this.translateText(item.description);
        
        // Vertimui suskirstome ilgą turinį į dalis
        const translatedContent = await this.translateText(item.content);
        
        console.log('Vertimas baigtas.');
        
        // Įkeliame paveikslėlį, jei jis yra
        let imageUrl: string | null = null;
        if (item.imageUrl) {
          console.log(`Bandoma įkelti paveikslėlį iš: ${item.imageUrl}`);
          imageUrl = await this.uploadImage(item.imageUrl, item.title);
          if (imageUrl) {
            console.log(`Paveikslėlis įkeltas: ${imageUrl}`);
          } else {
            console.log('Nepavyko įkelti paveikslėlio');
          }
        } else {
          console.log('Paveikslėlis nenurodytas RSS elemente');
        }
        
        // Įkelti originalią nuorodą į turinį
        const contentWithSource = `${translatedContent}<p><br><em>Šaltinis: <a href="${item.link}" target="_blank">${item.link}</a></em></p>`;
        
        // Kuriame naujienos įrašą
        console.log('Kuriamas naujienos įrašas...');
        const created = await this.createNewsItem(item, translatedTitle, translatedDescription, contentWithSource, imageUrl);
        
        if (created) {
          console.log(`Naujiena "${translatedTitle.substring(0, 50)}..." sėkmingai pridėta.`);
          importedCount++;
        } else {
          console.log(`Nepavyko sukurti naujienos įrašo: "${translatedTitle.substring(0, 50)}..."`);
        }
        
        // Jei pasiekėme dienos limitą, nutraukiame ciklą
        if (importedCount >= remainingNewsToday) {
          console.log(`Pasiektas dienos limitas (${this.maxNewsPerDay} naujienos per dieną).`);
          break;
        }
      }
      
      console.log(`RSS apdorojimas baigtas. Importuota ${importedCount} nauja(-os) naujiena(-os). Viso šiandien: ${todayNewsCount + importedCount}/${this.maxNewsPerDay}.`);
      
    } catch (error) {
      console.error("Klaida apdorojant RSS srautus:", error);
    }
  }
} 