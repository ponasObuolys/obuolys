import SEOHead from '@/components/SEO';
import { SITE_CONFIG } from '@/utils/seo';
import { ProjectCalculator } from '@/components/project-calculator/ProjectCalculator';

const ProjectCalculatorPage = () => {
  return (
    <>
      <SEOHead
        title="React/TypeScript Projekto Skaičiuoklė | Nemokamas Įvertinimas"
        description="Sužinokite orientacinę kainą ir trukmę jūsų React/TypeScript projektui per 2 minutes. Nemokama projekto skaičiuoklė su tech stack rekomendacijomis. MVP, CRM, E-commerce, Logistika. Supabase backend, Vercel deployment."
        canonical={`${SITE_CONFIG.domain}/skaiciuokle`}
        keywords={[
          'React projekto kaina',
          'TypeScript aplikacijos skaičiuoklė',
          'web aplikacijos kaina skaičiuoti',
          'MVP kaina Lietuva',
          'React kūrimo kaina',
          'Supabase projekto kaina',
          'aplikacijos kūrimo trukmė',
          'tech stack skaičiuoklė',
          'React freelancer kaina',
          'TypeScript programuotojo kaina',
        ]}
        type="website"
      />

      <ProjectCalculator />
    </>
  );
};

export default ProjectCalculatorPage;
