import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  bucket?: string;
  folder?: string;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

const FileUpload = ({
  onUploadComplete,
  bucket = 'site-images',
  folder = '',
  acceptedFileTypes = 'image/*',
  maxSizeMB = 5
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Patikrinti failo dydį
      if (selectedFile.size > maxSizeBytes) {
        toast({
          title: 'Klaida',
          description: `Failas per didelis. Maksimalus dydis: ${maxSizeMB}MB`,
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      toast({
        title: 'Klaida',
        description: 'Nepasirinktas failas',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Sukurti unikalų failo pavadinimą
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      // Įkelti failą į Supabase storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Gauti viešą URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      if (publicUrlData.publicUrl) {
        onUploadComplete(publicUrlData.publicUrl);
        toast({
          title: 'Sėkmingai įkelta',
          description: 'Failas sėkmingai įkeltas',
        });
        setFile(null);
      }
    } catch (error: any) {
      console.error('Įkeliant failą įvyko klaida:', error.message);
      toast({
        title: 'Klaida',
        description: `Nepavyko įkelti failo: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {file && (
        <div className="flex space-x-2">
          <Button 
            onClick={uploadFile} 
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Įkeliama...
              </>
            ) : (
              'Įkelti'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setFile(null)}
            disabled={isUploading}
          >
            Atšaukti
          </Button>
        </div>
      )}
    </div>
  );
};

export { FileUpload }; 