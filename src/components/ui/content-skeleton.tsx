import { Skeleton } from "./skeleton";

/**
 * CLS-optimized skeleton loaders for different content types
 * These reserve space to prevent layout shifts while content loads
 */

export const ArticleCardSkeleton = () => (
  <div className="dark-card space-y-4">
    {/* Image placeholder with fixed aspect ratio */}
    <Skeleton className="w-full aspect-video rounded-lg" />
    {/* Title */}
    <Skeleton className="h-6 w-3/4" />
    {/* Description lines */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    {/* Meta info */}
    <div className="flex gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const ToolCardSkeleton = () => (
  <div className="dark-card space-y-4">
    {/* Icon/Image */}
    <Skeleton className="w-12 h-12 rounded-lg" />
    {/* Title */}
    <Skeleton className="h-5 w-2/3" />
    {/* Description */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    {/* Tags */}
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const CourseCardSkeleton = () => (
  <div className="dark-card space-y-4">
    {/* Course image */}
    <Skeleton className="w-full aspect-video rounded-lg" />
    {/* Title */}
    <Skeleton className="h-6 w-4/5" />
    {/* Description */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    {/* Price and duration */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-24" />
    </div>
  </div>
);

export const HeroSectionSkeleton = () => (
  <div className="container mx-auto py-12 px-4 space-y-6">
    {/* Title */}
    <Skeleton className="h-12 w-3/4 mx-auto" />
    {/* Subtitle */}
    <div className="space-y-3 max-w-2xl mx-auto">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6 mx-auto" />
    </div>
    {/* CTA buttons */}
    <div className="flex gap-4 justify-center pt-4">
      <Skeleton className="h-12 w-32 rounded-xl" />
      <Skeleton className="h-12 w-32 rounded-xl" />
    </div>
  </div>
);

export const ArticleDetailSkeleton = () => (
  <div className="container mx-auto py-8 px-4 max-w-4xl">
    {/* Breadcrumbs */}
    <div className="flex gap-2 mb-6">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>

    {/* Title */}
    <Skeleton className="h-10 w-full mb-4" />
    <Skeleton className="h-10 w-3/4 mb-8" />

    {/* Meta */}
    <div className="flex gap-6 mb-8">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-24" />
    </div>

    {/* Featured image */}
    <Skeleton className="w-full aspect-video rounded-xl mb-8" />

    {/* Content paragraphs */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />

      <div className="py-4">
        <Skeleton className="h-6 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
);
