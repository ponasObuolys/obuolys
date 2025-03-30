
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Facebook, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useEffect } from 'react';

// Mock article data
const articles = {
  "chatgpt-versle": {
    title: "Kaip ChatGPT gali padėti jūsų verslui",
    date: "2023-06-15",
    readTime: "7 min.",
    author: "ponas Obuolys",
    category: "Verslas",
    content: `
      <p class="mb-4">ChatGPT yra vienas iš galingiausių dirbtinio intelekto įrankių, kurį galima pritaikyti įvairioms verslo sritims. Šiame straipsnyje aptarsime, kaip efektyviai išnaudoti ChatGPT savo versle.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Klientų aptarnavimas</h2>
      <p class="mb-4">Viena iš pagrindinių ChatGPT pritaikymo sričių versle yra klientų aptarnavimas. Šis AI įrankis gali:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Atsakyti į dažniausiai užduodamus klausimus 24/7</li>
        <li class="mb-2">Padėti klientams rasti produktus ar paslaugas</li>
        <li class="mb-2">Spręsti paprastas problemas be žmogaus įsikišimo</li>
        <li class="mb-2">Rinkti pradinę informaciją prieš perduodant sudėtingesnius atvejus darbuotojams</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Marketingas ir turinys</h2>
      <p class="mb-4">ChatGPT gali būti nepakeičiamas pagalbininkas kuriant marketingo medžiagą:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Generuoti idėjas socialinių tinklų įrašams</li>
        <li class="mb-2">Rašyti el. pašto naujienlaiškius</li>
        <li class="mb-2">Kurti prekės aprašymus</li>
        <li class="mb-2">Rašyti tinklaraščio straipsnius ir pagalbinį turinį</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Rinkos tyrimai</h2>
      <p class="mb-4">AI gali padėti analizuoti rinką ir konkurentus:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Apibendrinti didelius kiekius informacijos</li>
        <li class="mb-2">Identifikuoti tendencijas ir galimybes</li>
        <li class="mb-2">Analizuoti konkurentų strategijas</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Procesų optimizavimas</h2>
      <p class="mb-4">ChatGPT gali automatizuoti daug rutininių užduočių:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Rašyti standartines sutartis ir dokumentus</li>
        <li class="mb-2">Automatizuoti el. laiškų atsakymus</li>
        <li class="mb-2">Kurti procedūrų vadovus ir instrukcijas</li>
        <li class="mb-2">Padėti planuoti projektus ir susitikimus</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Kaip pradėti naudoti ChatGPT savo versle?</h2>
      <p class="mb-4">Štai keli patarimai, kaip pradėti:</p>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Identifikuokite sritis, kurias galima automatizuoti</li>
        <li class="mb-2">Pradėkite nuo mažų eksperimentų</li>
        <li class="mb-2">Visada patikrinkite AI sugeneruotą turinį</li>
        <li class="mb-2">Mokykite savo komandą efektyviai naudoti AI įrankius</li>
        <li class="mb-2">Nuolat matuokite rezultatus ir tobulinkite procesus</li>
      </ol>
      
      <p class="mb-4">Dirbtinis intelektas keičia verslo pasaulį, ir ChatGPT yra vienas iš prieinamiausių būdų pradėti naudoti šias technologijas savo įmonėje. Tinkamai pritaikytas, jis gali padėti taupyti laiką, mažinti išlaidas ir gerinti klientų patirtį.</p>
    `
  },
  // Additional article content would be defined here similarly
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articles[slug as keyof typeof articles] : null;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Straipsnis nerastas</h1>
          <p className="mb-6">Atsiprašome, bet ieškomas straipsnis neegzistuoja.</p>
          <Link to="/straipsniai">
            <Button className="button-primary">Grįžti į straipsnių sąrašą</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const shareFacebook = () => {
    const url = `https://ponasobuolys.lt/straipsniai/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12">
        <Link to="/straipsniai" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į straipsnių sąrašą</span>
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{article.readTime} skaitymo</span>
              </div>
              <div>
                Autorius: <span className="font-medium">{article.author}</span>
              </div>
            </div>
            
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mb-8">
              Straipsnio nuotrauka
            </div>
            
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="font-medium">Dalintis straipsniu:</p>
                <Button 
                  onClick={shareFacebook} 
                  className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  <span>Dalintis Facebook</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetail;
