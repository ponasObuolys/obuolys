import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedImage: string | null;
  crop: Crop;
  setCrop: (crop: Crop) => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onCropComplete: () => void;
}

export const ImageCropDialog = ({
  isOpen,
  onClose,
  uploadedImage,
  crop,
  setCrop,
  onImageLoad,
  onCropComplete,
}: ImageCropDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="crop-dialog-description">
        <DialogHeader>
          <DialogTitle>Apkarpykite profilio nuotrauką</DialogTitle>
        </DialogHeader>
        <p id="crop-dialog-description" className="text-sm text-muted-foreground mb-2">
          Apkarpykite savo profilio nuotrauką. Rekomenduojama kvadratinė forma.
        </p>
        <div className="py-4">
          {uploadedImage && (
            <ReactCrop crop={crop} onChange={c => setCrop(c)} circularCrop aspect={1}>
              <img src={uploadedImage} alt="Apkarpoma nuotrauka" onLoad={onImageLoad} />
            </ReactCrop>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Atšaukti
          </Button>
          <Button type="button" onClick={onCropComplete}>
            Išsaugoti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
