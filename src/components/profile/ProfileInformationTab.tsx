import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type ProfileFormValues } from "@/hooks/useProfileManagement";
import { type UseFormReturn } from "react-hook-form";
import { type Crop } from "react-image-crop";
import { ImageCropDialog } from "./ImageCropDialog";

interface ProfileInformationTabProps {
  profileData: { username?: string; avatarUrl?: string } | null;
  profileForm: UseFormReturn<ProfileFormValues>;
  profileError: string | null;
  savingProfile: boolean;
  onProfileSubmit: (data: ProfileFormValues) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Image cropping props
  showCropDialog: boolean;
  setShowCropDialog: (show: boolean) => void;
  uploadedImage: string | null;
  crop: Crop;
  setCrop: (crop: Crop) => void;
  imageRef: HTMLImageElement | null;
  setImageRef: (ref: HTMLImageElement | null) => void;
  handleCropComplete: () => Promise<void>;
}

export const ProfileInformationTab = ({
  profileData,
  profileForm,
  profileError,
  savingProfile,
  onProfileSubmit,
  handleImageUpload,
  showCropDialog,
  setShowCropDialog,
  uploadedImage,
  crop,
  setCrop,
  imageRef: _imageRef,
  setImageRef,
  handleCropComplete,
}: ProfileInformationTabProps) => {
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageRef(e.currentTarget);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profilio informacija</CardTitle>
          <CardDescription>
            Atnaujinkite savo asmeninę informaciją ir profilio nuotrauką
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profilio nuotrauka */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
            <div>
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profileData?.avatarUrl || ""}
                  alt={profileData?.username || "Vartotojas"}
                />
                <AvatarFallback>
                  {profileData?.username?.charAt(0).toUpperCase() || "V"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-lg font-medium">Profilio nuotrauka</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Įkelkite savo nuotrauką. Rekomenduojama kvadratinė nuotrauka.
              </p>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Profilio duomenų forma */}
          {profileError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vartotojo vardas</FormLabel>
                      <FormControl>
                        <Input placeholder="vartotojas123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>El. paštas</FormLabel>
                      <FormControl>
                        <Input placeholder="vardas@pavyzdys.lt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="mt-4" disabled={savingProfile}>
                {savingProfile ? "Išsaugoma..." : "Išsaugoti pakeitimus"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Image Crop Dialog */}
      <ImageCropDialog
        isOpen={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        uploadedImage={uploadedImage}
        crop={crop}
        setCrop={setCrop}
        onImageLoad={handleImageLoad}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};
