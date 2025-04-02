import { useState, useEffect } from 'react';
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
  convertToWebP?: boolean;
  quality?: number;
  useLocalStorageFallback?: boolean;
}

const FileUpload = ({
  onUploadComplete,
  bucket = 'site-images',
  folder = '',
  acceptedFileTypes = 'image/*',
  maxSizeMB = 5,
  convertToWebP = true,
  quality = 80,
  useLocalStorageFallback = true
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Patikrinti vartotojo informaciją, kai komponentas užsikrauna
  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        // Gauti prisijungusio vartotojo informaciją
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserInfo(user);
          
          // Patikrinti, ar vartotojas yra administratorius
          const { data: isAdminResult, error: isAdminError } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (isAdminError) {
            console.error("Klaida tikrinant administratoriaus teises:", isAdminError);
          } else {
            setIsAdmin(isAdminResult);
            console.log("Vartotojo administratoriaus statusas:", isAdminResult);
          }
        } else {
          console.log("Vartotojas neprisijungęs");
        }
      } catch (error) {
        console.error("Klaida gaunant vartotojo informaciją:", error);
      }
    };
    
    checkUserInfo();
  }, []);

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

  const handleImageUpload = (url: string) => {
    console.log("FileUpload handleImageUpload gavau URL:", url);
    // Tiesiogiai iškviečiame onUploadComplete funkciją su pilnu URL
    onUploadComplete(url);
  };

  const convertToWebPFormat = (imageFile: File): Promise<{blob: Blob, dataUrl: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Išsaugoti kaip dataURL
          const dataUrl = canvas.toDataURL('image/webp', quality / 100);
          
          // Taip pat konvertuoti į blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  blob: blob,
                  dataUrl: dataUrl
                });
              } else {
                reject(new Error('Failed to convert image to WebP'));
              }
            },
            'image/webp',
            quality / 100
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(imageFile);
    });
  };

  // Funkcija file konvertavimui į base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Funkcija įkelti failą į Supabase saugyklą
  const uploadToSupabase = async (fileToUpload: File | Blob, fileName: string, fileExtension: string) => {
    const filePath = folder ? `${folder}/${fileName}.${fileExtension}` : `${fileName}.${fileExtension}`;
    console.log("Bandoma įkelti failą į Supabase saugyklą:", filePath);
    console.log("Įkeliama į bucket:", bucket);
    
    try {
      // Tiesioginis įkėlimas į bucket
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.error("Klaida įkeliant į Supabase:", JSON.stringify(error));
        throw error;
      }
      
      console.log("Sėkmingai įkelta į Supabase:", data);
      
      // Gauti viešą URL tiesiogiai per getPublicUrl metodą
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
        
      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("Nepavyko gauti publicUrl:", publicUrlData);
        throw new Error("Nepavyko gauti viešo URL");
      }
      
      console.log("Gautas viešas URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Klaida uploadToSupabase funkcijoje:", err);
      throw err;
    }
  };

  // Funkcija saugoti failą vietinėje atmintyje
  const saveToLocalStorage = async (imageDataUrl: string, fileName: string, fileType: string, folderPath: string) => {
    const storageKey = `data:image;base64_${fileName}`;
    
    console.log("Saugoma vietinėje naršyklės atmintyje:", storageKey);
    
    // Išsaugome vietinėje naršyklės atmintyje
    const localStorageUrls = JSON.parse(localStorage.getItem('tempImageUrls') || '[]');
    localStorageUrls.push({
      url: storageKey,
      data: imageDataUrl,
      path: folderPath ? `${folderPath}/${fileName}` : fileName,
      mime_type: fileType,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('tempImageUrls', JSON.stringify(localStorageUrls));
    
    console.log("Sėkmingai išsaugota vietinėje atmintyje");
    
    return storageKey;
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
      console.log("------------------------");
      console.log("DIAGNOSTIKOS INFORMACIJA:");
      console.log("------------------------");
      console.log("Bandoma įkelti failą");
      console.log("Aplanko kelias:", folder);
      console.log("Failo tipas:", file.type);
      console.log("Failo dydis:", file.size, "baitų");
      
      // Sukurti unikalų failo pavadinimą
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${randomString}_${timestamp}`;
      
      let fileToUpload: File | Blob = file;
      let fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      let resultUrl = '';
      
      // Jei paveikslėlis ir reikia konvertuoti į WebP
      if (file.type.startsWith('image/') && convertToWebP) {
        try {
          console.log("Konvertuojama į WebP formatą...");
          const { blob } = await convertToWebPFormat(file);
          fileToUpload = blob;
          fileExtension = 'webp';
          console.log("Konvertavimas į WebP sėkmingas");
        } catch (conversionError) {
          console.error('Klaida konvertuojant į WebP:', conversionError);
          console.log("Naudojamas originalus failas");
        }
      }
      
      // Bandyti įkelti į Supabase saugyklą
      try {
        resultUrl = await uploadToSupabase(fileToUpload, fileName, fileExtension);
        console.log("Įkėlimas į Supabase sėkmingas:", resultUrl);
        
        // Tiesiogiai iškviesti handleImageUpload su gautu URL
        handleImageUpload(resultUrl);
        
        toast({
          title: 'Sėkmingai įkelta',
          description: file.type.startsWith('image/') && convertToWebP
            ? 'Paveikslėlis konvertuotas į WebP formatą ir sėkmingai įkeltas'
            : 'Failas sėkmingai įkeltas',
        });
        
        setFile(null);
      } catch (supabaseError) {
        console.error("Klaida įkeliant į Supabase:", supabaseError);
        throw supabaseError;
      }
    } catch (error: any) {
      console.error('Įkeliant failą įvyko klaida:');
      console.error(JSON.stringify(error));
      
      toast({
        title: 'Klaida',
        description: `Nepavyko įkelti failo: ${error.message || "Nežinoma klaida"}`,
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
      {isAdmin === false && (
        <div className="text-sm text-red-500 mt-2">
          Dėmesio: Jūs nesate administratorius, todėl gali nepavykti įkelti failų.
        </div>
      )}
    </div>
  );
};

// Pagalbinė funkcija gauti base64 paveikslėlį pagal raktą
export const getLocalImage = (key: string): string | null => {
  try {
    // Pirma bandyti iš tempImageUrls
    const tempUrls = JSON.parse(localStorage.getItem('tempImageUrls') || '[]');
    const tempImage = tempUrls.find((img: any) => img.url === key);
    if (tempImage) {
      return tempImage.data;
    }
    
    // Tada bandyti iš localImages
    const localImages = JSON.parse(localStorage.getItem('localImages') || '[]');
    const localImage = localImages.find((img: any) => img.url === key);
    if (localImage) {
      return localImage.data;
    }
    
    return null;
  } catch (error) {
    console.error("Klaida gaunant vietinį paveikslėlį:", error);
    return null;
  }
};

// Pridėti vardinį eksportą
export { FileUpload };
export default FileUpload; 