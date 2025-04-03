import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  bucket: string;
  folder: string;
  onUploadComplete: (url: string) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  folder,
  onUploadComplete,
  acceptedFileTypes = 'image/*',
  maxFileSizeMB = 5,
  buttonText = 'Įkelti failą',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview(null);
      return;
    }

    const selectedFile = e.target.files[0];

    // Patikrinti failo dydį
    if (selectedFile.size > maxSizeBytes) {
      toast({
        title: 'Klaida',
        description: `Failas per didelis. Maksimalus dydis: ${maxFileSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);

    // Sukurti peržiūros URL
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      // Naudojame originalų failą be optimizavimo
      const fileToUpload = file;

      // Sukurti unikalų failo pavadinimą
      const fileExt = fileToUpload.name.split('.').pop();
      // Generuojame unikalų ID be uuid bibliotekos
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const fileName = `${uniqueId}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Įkelti failą į Supabase
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Gauti viešą URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      // Pranešti apie sėkmingą įkėlimą
      toast({
        title: 'Sėkmingai įkelta',
        description: 'Failas buvo sėkmingai įkeltas',
      });

      // Perduoti URL į tėvinį komponentą
      onUploadComplete(urlData.publicUrl);
      clearFile();
    } catch (error: any) {
      toast({
        title: 'Įkėlimo klaida',
        description: error.message || 'Nepavyko įkelti failo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          disabled={uploading}
          className="flex-1"
        />
        {file && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFile}
            disabled={uploading}
            aria-label="Išvalyti"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {preview && (
        <div className="relative rounded-md border overflow-hidden aspect-video">
          <img
            src={preview}
            alt="Failo peržiūra"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {file && !preview && (
        <div className="flex items-center justify-center rounded-md border p-4 aspect-video">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span>{file.name}</span>
            <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        </div>
      )}

      {uploading && <Progress value={progress} className="h-2" />}

      <Button
        onClick={uploadFile}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? 'Įkeliama...' : buttonText}
        {!uploading && <Upload className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};

export default FileUpload;
