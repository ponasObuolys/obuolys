import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CTAManagement } from "@/components/admin/cta-management";
import { StickyMessagesManagement } from "@/components/admin/sticky-messages-management";
import { HeroManagement } from "@/components/admin/hero-management";

export default function CTAManagementPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CTA & Hero valdymas</h1>
        <p className="text-muted-foreground">
          Valdykite Call-to-Action sekcijas, sticky žinutes ir hero sekcijas
        </p>
      </div>

      <Tabs defaultValue="cta" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cta">CTA Sekcijos</TabsTrigger>
          <TabsTrigger value="sticky">Sticky Žinutės</TabsTrigger>
          <TabsTrigger value="hero">Hero Sekcijos</TabsTrigger>
        </TabsList>

        <TabsContent value="cta">
          <CTAManagement />
        </TabsContent>

        <TabsContent value="sticky">
          <StickyMessagesManagement />
        </TabsContent>

        <TabsContent value="hero">
          <HeroManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
