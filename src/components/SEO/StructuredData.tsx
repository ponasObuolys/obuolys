import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * StructuredData Component
 * Renders JSON-LD structured data for rich snippets
 */
export const StructuredData = ({ data }: StructuredDataProps) => {
  const structuredData = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
