import { RssFeedService } from "./RssFetchService";

/**
 * Paslauga atsakinga už periodinį RSS naujienų atnaujinimą.
 */
export class RssSchedulerService {
  private rssFeedService: RssFeedService;
  private intervalId: number | null = null;

  constructor(rssUrl: string, translationApiKey: string, maxNewsPerDay: number = 1) {
    this.rssFeedService = new RssFeedService(rssUrl, translationApiKey, maxNewsPerDay);
  }

  /**
   * Pradeda periodinį RSS naujienų atnaujinimą
   * @param intervalHours Atnaujinimo intervalas valandomis
   */
  public startScheduler(intervalHours: number = 24): void {
    // Iš karto paleiskime pirmą atnaujinimą
    this.updateNews();
    
    // Nustatome periodinį atnaujinimą
    const intervalMs = intervalHours * 60 * 60 * 1000;
    this.intervalId = window.setInterval(() => {
      this.updateNews();
    }, intervalMs);
    
    console.log(`RSS naujienų atnaujinimo planuoklis paleistas. Atnaujinimo intervalas: ${intervalHours} val.`);
  }

  /**
   * Sustabdo periodinį RSS naujienų atnaujinimą
   */
  public stopScheduler(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("RSS naujienų atnaujinimo planuoklis sustabdytas.");
    }
  }

  /**
   * Atnaujina naujienas iš RSS šaltinio
   */
  private async updateNews(): Promise<void> {
    try {
      console.log("Pradedamas RSS naujienų atnaujinimas...");
      await this.rssFeedService.processRssFeeds();
      console.log("RSS naujienų atnaujinimas baigtas sėkmingai.");
    } catch (error) {
      console.error("Klaida atnaujinant RSS naujienas:", error);
    }
  }
} 