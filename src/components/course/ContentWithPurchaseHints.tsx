import { useMemo } from 'react';
import { SafeRichText } from "@/components/ui/SafeHtml";
import { ProgressivePurchaseHint } from './ProgressivePurchaseHint';

interface ContentWithPurchaseHintsProps {
  content: string;
  currentPrice: {
    amount: number;
    label: string;
    savings: number;
  };
  onPurchase: () => void;
  className?: string;
}

/**
 * Intelligently places purchase hints throughout course content
 * Splits content and injects hints at strategic points
 */
export function ContentWithPurchaseHints({
  content,
  currentPrice,
  onPurchase,
  className = ''
}: ContentWithPurchaseHintsProps) {
  const contentWithHints = useMemo(() => {
    // Split content by paragraphs/sections
    const contentParts = content.split('</p>').filter(part => part.trim());

    if (contentParts.length < 3) {
      // Too short content - just show original content with one hint
      return {
        beforeContent: content,
        hints: ['reading']
      };
    }

    // Calculate strategic positions
    const totalParts = contentParts.length;
    const firstHintPosition = Math.floor(totalParts * 0.3); // 30% through content
    const secondHintPosition = Math.floor(totalParts * 0.7); // 70% through content

    return {
      firstPart: contentParts.slice(0, firstHintPosition).join('</p>') + '</p>',
      secondPart: contentParts.slice(firstHintPosition, secondHintPosition).join('</p>') + '</p>',
      thirdPart: contentParts.slice(secondHintPosition).join('</p>') + '</p>',
      hints: {
        first: 'reading' as const,
        second: currentPrice.savings > 0 ? 'value' as const : 'engagement' as const
      }
    };
  }, [content, currentPrice.savings]);

  // For short content
  if ('beforeContent' in contentWithHints) {
    return (
      <div className={className}>
        <SafeRichText
          content={contentWithHints.beforeContent || content}
          className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left"
        />

        <ProgressivePurchaseHint
          currentPrice={currentPrice}
          onPurchase={onPurchase}
          variant="reading"
          className="my-12"
        />
      </div>
    );
  }

  // For longer content with strategic placement
  return (
    <div className={className}>
      {/* First part of content */}
      <SafeRichText
        content={contentWithHints.firstPart}
        className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left"
      />

      {/* First purchase hint - after 30% */}
      <ProgressivePurchaseHint
        currentPrice={currentPrice}
        onPurchase={onPurchase}
        variant={contentWithHints.hints.first}
        className="my-12"
      />

      {/* Second part of content */}
      <SafeRichText
        content={contentWithHints.secondPart}
        className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left"
      />

      {/* Second purchase hint - after 70% (only if there's substantial content) */}
      {contentWithHints.thirdPart.length > 100 && (
        <ProgressivePurchaseHint
          currentPrice={currentPrice}
          onPurchase={onPurchase}
          variant={contentWithHints.hints.second}
          className="my-12"
        />
      )}

      {/* Final part of content */}
      <SafeRichText
        content={contentWithHints.thirdPart}
        className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left"
      />
    </div>
  );
}