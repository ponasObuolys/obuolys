import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Star, Check, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: string;
  duration: string;
  level: string;
  highlights: string[];
  published: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Funkcija Patreon nuorodai gauti pagal kurso slug
const getPatreonLink = (slug: string): string => {
  const patreonLinks: { [key: string]: string } = {
    'lovable-workshop-su-ponu-obuoliu': 'https://www.patreon.com/posts/lovable-workshop-120266952',
    'vibe-coding-masterclass': 'https://www.patreon.com/posts/vibe-coding-su-125505176'
  };
  return patreonLinks[slug] || '#';
};

const CourseDetail: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Fetching course with slug:', slug);
        // Fetch as an array, limit to 1 result
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .limit(1); 

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Course data array received:', data);
        // Check if the array has data
        if (data && data.length > 0) {
          setCourse(data[0]); // Set the first element
        } else {
          console.log('No course data found');
          setCourse(null); // Explicitly set to null if no data
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Klaida",
          description: "Nepavyko gauti kurso informacijos. Bandykite vėliau.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Kraunama...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Kursas nerastas</h1>
        <p className="mb-6">Atsiprašome, bet ieškomas kursas neegzistuoja.</p>
        <Link to="/kursai">
          <Button className="button-primary">Grįžti į kursų sąrašą</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/kursai" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Grįžti į kursų sąrašą</span>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-primary" />
                <span>{course.level}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Ką išmoksite:</h3>
              <ul className="space-y-2">
                {course.highlights?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.content }} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-primary mb-2">{course.price}</p>
              <div className="text-sm mb-4 text-gray-500">Vienkartinis mokėjimas, prieiga neribotam laikui</div>
              <Button 
                className="w-full button-primary text-lg py-6"
                onClick={() => window.location.href = getPatreonLink(course.slug)}
              >
                Įsigyti kursą
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-bold mb-4">Kursas apima:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Neribota prieiga prie kurso medžiagos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Praktiniai užsiėmimai ir užduotys</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Tiesioginis ryšys su dėstytoju</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
