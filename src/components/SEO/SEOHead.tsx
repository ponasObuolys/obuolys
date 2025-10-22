import type { PageSEO } from "@/utils/seo";
import { MetaTags } from "./MetaTags";
import { OpenGraphTags } from "./OpenGraphTags";
import { StructuredData } from "./StructuredData";

interface SEOHeadProps extends PageSEO {
  structuredData?: object | object[];
}

/**
 * SEOHead Component
 * Main SEO wrapper component that combines all SEO meta tags and structured data
 *
 * Usage:
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   canonical="/path"
 *   image="/image.jpg"
 *   structuredData={articleSchema}
 * />
 */
export const SEOHead = ({ structuredData, ...seoProps }: SEOHeadProps) => {
  return (
    <>
      <MetaTags {...seoProps} />
      <OpenGraphTags {...seoProps} />
      {structuredData && <StructuredData data={structuredData} />}
    </>
  );
};

export default SEOHead;
