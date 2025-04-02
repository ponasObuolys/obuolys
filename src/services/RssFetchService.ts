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
      console.log('Siunčiamasi naujienos iš:', this.rssUrl);
      const response = await fetch(this.rssUrl);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const items = Array.from(xmlDoc.querySelectorAll("item"));
      
      return await Promise.all(items.map(async item => {
        // Ištraukiame paveikslėlio URL iš turinio
        let imageUrl: string | undefined;
        let content = item.querySelector("content\\:encoded")?.textContent || 
                     item.querySelector("encoded")?.textContent || 
                     "";
        
        if (!content || content.trim() === '') {
          // Jei nėra turinio, pabandome ištraukti jį iš aprašymo
          const description = item.querySelector("description")?.textContent || "";
          
          // Patikrinti, ar aprašymas turi HTML turinį
          if (description.includes('<') && description.includes('>')) {
            content = description;
          } else {
            // Jei nėra HTML turinio, bandome gauti jį iš originalaus straipsnio
            const link = item.querySelector("link")?.textContent || "";
            if (link) {
              try {
                console.log('Bandoma ištraukti turinį iš originalaus straipsnio:', link);
                const articleContent = await this.fetchOriginalArticleContent(link);
                if (articleContent) {
                  content = articleContent;
                  console.log('Sėkmingai ištrauktas turinys iš originalaus straipsnio');
                }
              } catch (fetchError) {
                console.error('Nepavyko ištraukti turinio iš originalaus straipsnio:', fetchError);
              }
            }
          }
        }
        
        // Ištraukiame paveikslėlio URL iš turinio
        if (content) {
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
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
          content: content,
          imageUrl
        };
      }));
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

      // Naudojame Vercel serverless funkciją kaip proxy
      // Numatytasis kelias yra /api/translate
      const proxyUrl = process.env.REACT_APP_TRANSLATION_PROXY_URL || '/api/translate';
      
      console.log('Naudojamas proxy serveris vertimui:', proxyUrl);
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
        const errorData = await response.text();
        throw new Error(`Proxy serverio klaida: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.translatedText || text;
      
    } catch (error) {
      console.error('Klaida verčiant tekstą su DeepL:', error);
      
      // Grąžiname originalų tekstą klaidos atveju
      return text;
    }
  }

  /**
   * Gauna straipsnio turinį iš originalaus šaltinio
   */
  private async fetchOriginalArticleContent(url: string): Promise<string | null> {
    try {
      // Naudojame serverio proxy, kad apeitume CORS apribojimus
      const proxyUrl = '/api/article-content';
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        throw new Error(`Nepavyko gauti straipsnio turinio: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.html) {
        return null;
      }
      
      const html = data.html;
      
      // Ieškome straipsnio turinio naudodami paprastą DOM manipuliaciją
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Bandome rasti straipsnio turinį pagal įvairias euristikas
      // 1. Ieškome article elemento
      let contentElement = doc.querySelector('article');
      
      // 2. Arba ieškome pagal įvairius klasės pavadinimus, kurie dažnai naudojami straipsniams
      if (!contentElement) {
        contentElement = doc.querySelector('.article-content, .post-content, .entry-content, .content-body, main');
      }
      
      // 3. Jei vis dar neradome, tiesiog imame body
      if (!contentElement) {
        contentElement = doc.body;
      }
      
      if (!contentElement) {
        return null;
      }
      
      // Tikriname, ar yra bent keletas pastraipų
      const paragraphs = contentElement.querySelectorAll('p');
      if (paragraphs.length < 2) {
        return null;
      }
      
      // Ištraukiame tik pagrindinį turinį, be navigacijos, footerių ir pan.
      return contentElement.innerHTML;
    } catch (error) {
      console.error('Klaida gaunant straipsnio turinį:', error);
      return null;
    }
  }

  /**
   * Parsiunčia paveikslėlį ir įkelia į Supabase saugyklą
   */
  private async uploadImage(url: string, itemTitle: string): Promise<string | null> {
    try {
      console.log('Bandoma parsisiųsti paveikslėlį iš:', url);
      
      // Naudojame paveikslėlių proxy serverį
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      
      // Tiesiogiai siųsti į Supabase, nenaudojant tarpinio blob
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Nepavyko parsisiųsti paveikslėlio: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Parsisiųstas paveikslėlis yra tuščias');
      }
      
      console.log(`Sėkmingai parsisiųstas paveikslėlis: ${url}, dydis: ${blob.size} baitų, tipas: ${blob.type}`);
      
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
      
      console.log('Paveikslėlis sėkmingai įkeltas į:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Klaida įkeliant paveikslėlį:", error);
      
      // Bandome alternatyvų metodą
      try {
        console.log('Bandomas alternatyvus paveikslėlio parsisiuntimo metodas');
        
        // Sukurkime img elementą su proxy URL
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
        
        return await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = async () => {
            try {
              // Nupieškime paveikslėlį į canvas, kad gautume blob
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0);
              
              // Konvertuojame į blob
              canvas.toBlob(async (blob) => {
                if (!blob) {
                  reject(new Error('Nepavyko konvertuoti paveikslėlio į blob'));
                  return;
                }
                
                // Įkeliam į Supabase
                const fileName = `${Date.now()}-${itemTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
                const filePath = `news/covers/${fileName}`;
                
                const { data, error } = await supabase.storage
                  .from('site-images')
                  .upload(filePath, blob);
                
                if (error) {
                  reject(error);
                  return;
                }
                
                // Gauname viešą URL
                const { data: urlData } = supabase.storage
                  .from('site-images')
                  .getPublicUrl(filePath);
                
                console.log('Paveikslėlis sėkmingai įkeltas (alternatyviu metodu) į:', urlData.publicUrl);
                resolve(urlData.publicUrl);
              }, 'image/png');
            } catch (canvasError) {
              reject(canvasError);
            }
          };
          img.onerror = () => {
            reject(new Error('Nepavyko užkrauti paveikslėlio'));
          };
          img.src = proxyUrl;
        });
      } catch (altError) {
        console.error("Klaida naudojant alternatyvų metodą:", altError);
        
        // Jei nepavyko parsisiųsti paveikslėlio, naudojame placeholder
        return 'https://storage.googleapis.com/ponasobuolys.appspot.com/default-news-image.jpg';
      }
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