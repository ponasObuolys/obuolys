import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { getCurrentPrice } from '@/config/stripe';
import { secureLogger } from '@/utils/browserLogger';

interface UseCoursePurchaseProps {
  courseId: string;
  courseTitle?: string; // Optional, not used currently but might be needed for analytics
}

/**
 * Custom hook Stripe Checkout sesijos kūrimui ir kurso pirkimui
 */
export function useCoursePurchase({ courseId, courseTitle: _courseTitle }: UseCoursePurchaseProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = getCurrentPrice();

  const purchaseCourse = async () => {
    try {
      setIsLoading(true);

      // Gauti dabartinę kainą
      const priceInfo = getCurrentPrice();

      // Sukurti Stripe Checkout sesiją
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceInfo.priceId,
          courseId,
          userId: user?.id || null,
          customerEmail: user?.email || '',
          customerName: user?.user_metadata?.full_name || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        secureLogger.error('API Error:', errorData);
        throw new Error(errorData.details || 'Nepavyko sukurti mokėjimo sesijos');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('Negautas mokėjimo URL');
      }

      // Nukreipti į Stripe Checkout
      window.location.href = url;
    } catch (error) {
      secureLogger.error('Purchase error:', error);
      toast({
        title: 'Klaida',
        description:
          error instanceof Error
            ? error.message
            : 'Nepavyko pradėti mokėjimo proceso. Bandykite dar kartą.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    purchaseCourse,
    isLoading,
    currentPrice,
  };
}
