import { supabase } from "@/integrations/supabase/client";
import { secureLogger } from "@/utils/browserLogger";
import { hasAnalyticsConsent } from "@/components/gdpr/cookie-consent.utils";

/**
 * Generate a unique session ID for tracking unique visitors
 */
function getSessionId(): string {
  const SESSION_KEY = "obuolys_session_id";
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Check if article was recently viewed (within last 30 minutes)
 */
function wasRecentlyViewed(articleId: string): boolean {
  const RECENT_VIEWS_KEY = "obuolys_recent_views";
  const VIEW_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  try {
    const recentViewsStr = localStorage.getItem(RECENT_VIEWS_KEY);
    if (!recentViewsStr) return false;
    
    const recentViews: Record<string, number> = JSON.parse(recentViewsStr);
    const lastViewTime = recentViews[articleId];
    
    if (!lastViewTime) return false;
    
    const timeSinceView = Date.now() - lastViewTime;
    return timeSinceView < VIEW_TIMEOUT;
  } catch {
    return false;
  }
}

/**
 * Mark article as recently viewed
 */
function markAsViewed(articleId: string): void {
  const RECENT_VIEWS_KEY = "obuolys_recent_views";
  const VIEW_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  try {
    const recentViewsStr = localStorage.getItem(RECENT_VIEWS_KEY);
    const recentViews: Record<string, number> = recentViewsStr 
      ? JSON.parse(recentViewsStr) 
      : {};
    
    // Clean up old views (older than 30 minutes)
    const now = Date.now();
    Object.keys(recentViews).forEach(key => {
      if (now - recentViews[key] > VIEW_TIMEOUT) {
        delete recentViews[key];
      }
    });
    
    // Mark current article as viewed
    recentViews[articleId] = now;
    localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(recentViews));
  } catch (error) {
    secureLogger.error("Failed to mark article as viewed", { error, articleId });
  }
}

/**
 * Track page view for analytics
 * Only tracks if article wasn't viewed in the last 30 minutes and user has given consent
 */
export async function trackPageView(articleId: string): Promise<void> {
  try {
    // Check if user has given analytics consent
    if (!hasAnalyticsConsent()) {
      secureLogger.debug("Analytics consent not given, skipping tracking", { articleId });
      return;
    }

    // Check if article was recently viewed
    if (wasRecentlyViewed(articleId)) {
      secureLogger.debug("Article recently viewed, skipping tracking", { articleId });
      return;
    }

    const sessionId = getSessionId();
    const { data: userData } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("page_views")
      .insert({
        article_id: articleId,
        user_id: userData?.user?.id || null,
        session_id: sessionId,
        user_agent: navigator.userAgent,
      });

    if (error) {
      throw error;
    }

    // Mark article as viewed after successful tracking
    markAsViewed(articleId);
  } catch (error) {
    secureLogger.error("Failed to track page view", { error, articleId });
  }
}

/**
 * Get article view count with display multiplier (2x-4x)
 */
export async function getArticleDisplayCount(articleId: string): Promise<{
  actualCount: number;
  displayCount: number;
} | null> {
  try {
    const { data, error } = await supabase
      .rpc("get_article_view_count", { p_article_id: articleId })
      .single();

    if (error) {
      throw error;
    }

    return {
      actualCount: data.view_count,
      displayCount: data.display_count,
    };
  } catch (error) {
    secureLogger.error("Failed to get article display count", { error, articleId });
    return null;
  }
}

/**
 * Get article view count
 */
export async function getArticleViewCount(articleId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .eq("article_id", articleId);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    secureLogger.error("Failed to get article view count", { error, articleId });
    return 0;
  }
}

export const analyticsService = {
  trackPageView,
  getArticleDisplayCount,
  getArticleViewCount,
};
