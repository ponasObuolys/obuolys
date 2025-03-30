
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect } from 'react';

// Mock news data
const newsData = {
  "openai-gpt5": {
    title: "OpenAI pristato GPT-5",
    date: "2023-08-15",
    author: "ponas Obuolys",
    content: `
      <p class="mb-4">OpenAI šiandien pristatė ilgai lauktą GPT-5 modelį, kuris žymi reikšmingą žingsnį dirbtinio intelekto technologijų srityje. Naujasis modelis gerokai viršija savo pirmtakų galimybes ir siūlo įspūdingus patobulinimus keliose srityse.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Pagrindiniai patobulinimai</h2>
      <p class="mb-4">GPT-5 pasižymi keliais svarbiais patobulinimais:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Ženkliai pagerintas konteksto langas, leidžiantis modeliui išlaikyti ilgesnius pokalbius</li>
        <li class="mb-2">Pagerinta gebėjimas spręsti sudėtingas matematines problemas</li>
        <li class="mb-2">Tobulesnis įvairių kalbų supratimas ir vertimas</li>
        <li class="mb-2">Geresnis nurodymų laikymasis ir nuoseklumas</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Naujos galimybės</h2>
      <p class="mb-4">GPT-5 siūlo keletą naujų funkcijų:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Integruota vaizdo atpažinimo technologija</li>
        <li class="mb-2">Geresnė kodo generavimo ir analizės sistema</li>
        <li class="mb-2">Pagerinta gebėjimas kurti ir analizuoti sudėtingus dokumentus</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Saugumo aspektai</h2>
      <p class="mb-4">OpenAI teigia, kad saugumas buvo vienas iš pagrindinių prioritetų kuriant GPT-5. Modelis buvo kruopščiai testuojamas siekiant užtikrinti, kad jis:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Mažiau linkęs generuoti žalingą ar neteisingą informaciją</li>
        <li class="mb-2">Geriau atpažįsta ir atmeta netinkamus prašymus</li>
        <li class="mb-2">Veikia pagal griežtesnius saugumo parametrus</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Kada bus prieinama?</h2>
      <p class="mb-4">OpenAI pranešė, kad GPT-5 bus prieinamas etapais:</p>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Pirmiausia - tyrimų partneriams ir išrinktiems kūrėjams</li>
        <li class="mb-2">Vėliau - ChatGPT Plus prenumeratoriams</li>
        <li class="mb-2">Galiausiai - plačiajai visuomenei per API ir kitas platformas</li>
      </ol>
      
      <p class="mb-4">Šis naujas modelis neabejotinai turės didelį poveikį daugeliui pramonės šakų ir asmeninio AI naudojimo scenarijų. Mes ir toliau stebėsime jo vystymąsi ir informuosime apie svarbiausius pokyčius.</p>
    `
  },
  // Additional news content would be defined here similarly
};

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const news = slug ? newsData[slug as keyof typeof newsData] : null;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (!news) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Naujiena nerasta</h1>
          <p className="mb-6">Atsiprašome, bet ieškoma naujiena neegzistuoja.</p>
          <Link to="/naujienos">
            <Button className="button-primary">Grįžti į naujienų sąrašą</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12">
        <Link to="/naujienos" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į naujienų sąrašą</span>
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{news.date}</span>
              </div>
              <div>
                Autorius: <span className="font-medium">{news.author}</span>
              </div>
            </div>
            
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mb-8">
              Naujienos nuotrauka
            </div>
            
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
