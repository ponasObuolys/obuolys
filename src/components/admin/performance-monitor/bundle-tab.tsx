import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const BundleTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bundle optimizacija</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Pagrindinis bundle:</span>
              <Badge variant="outline" className="font-mono">
                ~81KB (24KB gzip)
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pradinis dydis:</span>
              <span className="font-mono text-red-600">~815KB</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Optimizuotas dydis:</span>
              <span className="font-mono text-green-600">~420KB</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pagerinimas:</span>
              <Badge variant="default">48% mažiau</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Chunk'ų skaičius:</span>
              <span className="font-mono">~16 dalių</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gzip sertifikavimas:</span>
              <Badge variant="secondary">3:1 suspaudimas</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chunk strategija</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Vendor chunks:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• react-core (~85KB)</li>
                  <li>• ui-overlay (~35KB)</li>
                  <li>• form-lib (~22KB)</li>
                  <li>• query-lib (~69KB)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Feature chunks:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• admin-dashboard (~145KB)</li>
                  <li>• auth-pages (~115KB)</li>
                  <li>• content-* (~80KB)</li>
                  <li>• shared-components (~35KB)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
