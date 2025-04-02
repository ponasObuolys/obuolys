import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { RssSchedulerService } from '@/services/RssSchedulerService';

// Schema validacijai
const formSchema = z.object({
  rssUrl: z.string().url({ message: "Įveskite teisingą URL adresą" }),
  translationApiKey: z.string().min(1, { message: "API raktas yra privalomas" }),
  updateInterval: z.coerce.number().int().min(1, { message: "Intervalas turi būti bent 1 valanda" }).max(48, { message: "Intervalas negali būti didesnis nei 48 valandos" }),
  autoUpdateEnabled: z.boolean()
});

type FormValues = z.infer<typeof formSchema>;

let rssSchedulerInstance: RssSchedulerService | null = null;

const RssSettingsPanel = () => {
  const [isWorking, setIsWorking] = useState(false);
  const { toast } = useToast();

  // Formos nustatymai
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rssUrl: 'https://knowtechie.com/category/ai/feed/',
      translationApiKey: '',
      updateInterval: 24,
      autoUpdateEnabled: false
    }
  });

  // Įkrauname išsaugotus nustatymus
  useEffect(() => {
    const savedSettings = localStorage.getItem('rssSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        form.reset(settings);
        
        // Jei buvo įjungtas automatinis atnaujinimas, atnaujinkime planuoklį
        if (settings.autoUpdateEnabled) {
          startRssScheduler(settings.rssUrl, settings.translationApiKey, settings.updateInterval);
        }
      } catch (error) {
        console.error('Klaida įkraunant išsaugotus RSS nustatymus:', error);
      }
    }
  }, [form]);

  // Formos pateikimo apdorojimas
  const onSubmit = async (values: FormValues) => {
    try {
      setIsWorking(true);
      
      // Išsaugome nustatymus localStorage
      localStorage.setItem('rssSettings', JSON.stringify(values));
      
      // Sustabdome esamą planuoklį
      if (rssSchedulerInstance) {
        rssSchedulerInstance.stopScheduler();
        rssSchedulerInstance = null;
      }
      
      // Jei įjungtas automatinis atnaujinimas, paleiskime naują planuoklį
      if (values.autoUpdateEnabled) {
        startRssScheduler(values.rssUrl, values.translationApiKey, values.updateInterval);
      }
      
      toast({
        title: "Nustatymai išsaugoti",
        description: "RSS naujienų importavimo nustatymai sėkmingai atnaujinti.",
      });
    } catch (error) {
      console.error('Klaida išsaugant RSS nustatymus:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti nustatymų. Bandykite dar kartą.",
        variant: "destructive"
      });
    } finally {
      setIsWorking(false);
    }
  };

  // Rankinio atnaujinimo funkcionalumas
  const handleManualUpdate = async () => {
    try {
      setIsWorking(true);
      
      const values = form.getValues();
      const rssFeedService = new RssSchedulerService(values.rssUrl, values.translationApiKey);
      
      toast({
        title: "Atnaujinimas pradėtas",
        description: "RSS naujienų atnaujinimas pradėtas. Tai gali užtrukti kelias minutes.",
      });
      
      // Paleidžiame vieną atnaujinimą
      await rssFeedService.startScheduler(0);
      rssFeedService.stopScheduler();
      
      toast({
        title: "Atnaujinimas baigtas",
        description: "RSS naujienos sėkmingai atnaujintos.",
      });
    } catch (error) {
      console.error('Klaida atnaujinant RSS naujienas:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko atnaujinti RSS naujienų. Bandykite dar kartą.",
        variant: "destructive"
      });
    } finally {
      setIsWorking(false);
    }
  };
  
  // Planuoklio paleidimo funkcija
  const startRssScheduler = (rssUrl: string, translationApiKey: string, updateInterval: number) => {
    try {
      // Nustatome maksimalų naujienų kiekį per dieną = 1
      const maxNewsPerDay = 1;
      rssSchedulerInstance = new RssSchedulerService(rssUrl, translationApiKey, maxNewsPerDay);
      rssSchedulerInstance.startScheduler(updateInterval);
    } catch (error) {
      console.error('Klaida paleidžiant RSS planuoklį:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSS naujienų importavimo nustatymai</CardTitle>
        <CardDescription>
          Konfigūruokite automatinius naujienų importavimo nustatymus iš RSS šaltinio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rssUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RSS šaltinio URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://rss.app/feeds/example.xml" {...field} />
                  </FormControl>
                  <FormDescription>
                    Įveskite RSS naujienų šaltinio URL adresą
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="translationApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DeepL API raktas</FormLabel>
                  <FormControl>
                    <Input placeholder="Jūsų DeepL API raktas" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Reikalingas automatiniam naujienų vertimui į lietuvių kalbą. Gaukite nemokamą raktą <a href="https://www.deepl.com/pro#developer" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DeepL svetainėje</a>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="updateInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atnaujinimo intervalas (valandos)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={48} {...field} />
                  </FormControl>
                  <FormDescription>
                    Kaip dažnai tikrinti naujas naujienas (1-48 valandos)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="autoUpdateEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Automatinis atnaujinimas</FormLabel>
                    <FormDescription>
                      Įjungti automatinį naujienų atnaujinimą
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleManualUpdate}
                disabled={isWorking}
              >
                Atnaujinti dabar
              </Button>
              <Button type="submit" disabled={isWorking}>
                {isWorking ? "Vykdoma..." : "Išsaugoti nustatymus"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground flex flex-col items-start gap-2">
        <p>Pastaba: Naujienų atnaujinimas gali užtrukti priklausomai nuo jų kiekio. Vertimui naudojamas DeepL API, kuris pateikia aukštos kokybės vertimus.</p>
        <p className="font-semibold text-amber-600">Svarbu: Sistema importuos tik po vieną naują naujieną per dieną. Daugiau naujienų galima pridėti tik rankiniu būdu.</p>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-md text-amber-700">
          <h4 className="font-semibold mb-1">ℹ️ Naujienų importavimo konfigūracija</h4>
          <p>RSS naujienų importavimui sukurti proxy serveriai, kurie jau paruošti naudojimui:</p>
          
          <div className="mt-2">
            <strong>Vercel serverless funkcijos:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li><code>/api/rssfeed</code> - RSS šaltinio duomenų nuskaitymui</li>
              <li><code>/api/translate</code> - DeepL API vertimui</li>
            </ul>
          </div>
          
          <div className="mt-2">
            <strong>Aplinkos kintamieji:</strong>
            <div className="bg-gray-100 p-2 mt-1 mb-2 rounded font-mono text-xs">
              REACT_APP_RSS_PROXY_URL=/api/rssfeed<br/>
              REACT_APP_TRANSLATION_PROXY_URL=/api/translate
            </div>
          </div>
          
          <p className="mt-2">
            <strong>Diegimo statusas:</strong> Serverio pusės proxy jau sukonfigūruoti ir paruošti naudojimui. 
            Jei pastebisite problemas su CORS, patikrinkite ar aplinkos kintamieji teisingai nustatyti.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
          <h4 className="font-semibold mb-1">⚡ Alternatyvus sprendimas: Supabase Edge funkcijos</h4>
          <p>Jei Vercel sprendimas neveikia arba pageidaujate naudoti Supabase infrastruktūrą, galite įjungti Edge funkcijas:</p>
          
          <div className="bg-blue-100 p-2 mt-2 rounded">
            <strong>Kaip aktyvuoti Supabase sprendimą:</strong>
            <ol className="list-decimal pl-5 mt-1">
              <li>Įdiekite Supabase Edge funkcijas iš <code>/supabase/functions/</code> katalogo</li>
              <li>Nustatykite aplinkos kintamuosius:</li>
              <div className="bg-gray-100 p-2 mt-1 mb-2 rounded font-mono text-xs">
                REACT_APP_RSS_PROXY_URL=https://[jūsų-projektas].supabase.co/functions/v1/rssfeed<br/>
                REACT_APP_TRANSLATION_PROXY_URL=https://[jūsų-projektas].supabase.co/functions/v1/translate
              </div>
            </ol>
          </div>
          
          <p className="mt-2 text-xs">Išsamiau: <a href="/RSS_INFO.md" className="underline">RSS_INFO.md</a> ir <a href="/SUPABASE_FUNCTIONS.md" className="underline">SUPABASE_FUNCTIONS.md</a></p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RssSettingsPanel; 