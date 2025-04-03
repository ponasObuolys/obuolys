/**
 * Facebook sharing utility functions
 */

// Declare the FB global object from the Facebook SDK
declare global {
  interface Window {
    FB: any;
  }
}

/**
 * Initialize the Facebook SDK
 * This should be called once when your app starts
 */
export const initFacebookSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    // Wait for FB SDK to be loaded
    const checkFB = () => {
      if (window.FB) {
        resolve();
      } else {
        setTimeout(checkFB, 100);
      }
    };
    
    checkFB();
  });
};

/**
 * Share content to Facebook using the FB SDK
 * This is the most reliable method for sharing to Facebook
 */
export const shareFacebookWithSDK = (options: {
  url: string;
  title?: string;
  description?: string;
  quote?: string;
  hashtag?: string;
}): Promise<void> => {
  const { url, quote, hashtag } = options;
  
  return new Promise((resolve, reject) => {
    initFacebookSDK().then(() => {
      try {
        window.FB.ui({
          method: 'share',
          href: url,
          quote: quote || options.title || '',
          hashtag: hashtag ? `#${hashtag}` : undefined,
        }, (response: any) => {
          if (response && !response.error_code) {
            resolve();
          } else {
            // Fall back to URL method if FB dialog fails
            fallbackToUrlShare(options);
            resolve();
          }
        });
      } catch (error) {
        console.error('Error sharing to Facebook:', error);
        fallbackToUrlShare(options);
        reject(error);
      }
    }).catch((error) => {
      console.error('Error initializing Facebook SDK:', error);
      fallbackToUrlShare(options);
      reject(error);
    });
  });
};

/**
 * Fallback method using URL sharing
 * Used when the FB SDK is not available or fails
 */
export const fallbackToUrlShare = (options: {
  url: string;
  title?: string;
  description?: string;
}): void => {
  const { url, title, description } = options;
  
  try {
    // Create Facebook share URL with parameters
    const shareUrl = new URL('https://www.facebook.com/sharer/sharer.php');
    shareUrl.searchParams.append('u', url);
    
    // Open share dialog
    const shareWindow = window.open(
      shareUrl.toString(),
      'facebook-share-dialog',
      'width=626,height=436,resizable=yes,scrollbars=yes'
    );
    
    // Check if popup was blocked
    if (!shareWindow || shareWindow.closed || typeof shareWindow.closed === 'undefined') {
      console.log('Facebook share window may have been blocked. Redirecting...');
      window.location.href = shareUrl.toString();
    }
  } catch (error) {
    console.error('Error with fallback Facebook share:', error);
    // Last resort fallback
    window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  }
};

/**
 * Share content to Facebook
 * This function tries multiple approaches to ensure sharing works
 */
export const shareToFacebook = async (options: {
  url: string;
  title?: string;
  description?: string;
  quote?: string;
  hashtag?: string;
}): Promise<void> => {
  try {
    // First try the SDK method
    await shareFacebookWithSDK(options);
  } catch (error) {
    console.error('Facebook SDK sharing failed, using fallback:', error);
    // Fall back to URL method
    fallbackToUrlShare(options);
  }
};
