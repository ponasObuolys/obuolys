import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createErrorReport, reportError } from "@/utils/errorReporting";
import { isFeatureEnabled } from "@/utils/featureFlags";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type Crop } from "react-image-crop";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Schema definitions
export const profileSchema = z.object({
  username: z.string().min(3, "Vartotojo vardas turi būti bent 3 simbolių"),
  email: z.string().email("Neteisingas el. pašto formatas"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Slaptažodis turi būti bent 6 simbolių"),
    newPassword: z.string().min(6, "Slaptažodis turi būti bent 6 simbolių"),
    confirmPassword: z.string().min(6, "Slaptažodis turi būti bent 6 simbolių"),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Slaptažodžiai nesutampa",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

// Profile management hook
export const useProfileManagement = () => {
  const { user, loading, updateUserProfile, updatePassword, uploadProfileImage, getUserProfile } =
    useAuth();
  const [profileData, setProfileData] = useState<{ username?: string; avatarUrl?: string } | null>(
    null
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Error and loading states
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Image cropping states
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  // Notification settings (only implemented features)
  const [emailNotifications, setEmailNotifications] = useState({
    newsletter: false, // Not implemented yet
    comments: true, // Only this is functional
    courseUpdates: false, // Not implemented yet
    publicationUpdates: false, // Not implemented yet
  });

  // Activity data
  const [savedPublications, setSavedPublications] = useState<
    Array<{ id: string; title: string; date: string; image: string }>
  >([]);
  const [enrolledCourses, setEnrolledCourses] = useState<
    Array<{ id: string; title: string; image: string; progress: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch saved publications
  const fetchSavedPublications = useCallback(async () => {
    if (!isFeatureEnabled('savedPublications')) {
      toast({
        title: "Funkcija neprieinama",
        description: "Išsaugotų publikacijų funkcija dar neįdiegta.",
        variant: "default",
      });
      setSavedPublications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual Supabase query when user_saved_publications table is created
      // const { data, error } = await supabase
      //   .from('user_saved_publications')
      //   .select('*, publication:publications(*)')
      //   .eq('user_id', user?.id);
      throw new Error('Not implemented');
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Klaida gaunant išsaugotas publikacijas");
      reportError(
        createErrorReport(err, {
          additionalData: { scope: "useProfileManagement.fetchSavedPublications" },
        })
      );
      toast({
        title: "Klaida",
        description: "Nepavyko gauti išsaugotų publikacijų.",
        variant: "destructive",
      });
      setSavedPublications([]);
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    if (!isFeatureEnabled('enrolledCourses')) {
      toast({
        title: "Funkcija neprieinama",
        description: "Prenumeruojamų kursų funkcija dar neįdiegta.",
        variant: "default",
      });
      setEnrolledCourses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual Supabase query when user_enrolled_courses table is created
      // const { data, error } = await supabase
      //   .from('user_enrolled_courses')
      //   .select('*, course:courses(*)')
      //   .eq('user_id', user?.id);
      throw new Error('Not implemented');
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Klaida gaunant prenumeruojamus kursus");
      reportError(
        createErrorReport(err, {
          additionalData: { scope: "useProfileManagement.fetchEnrolledCourses" },
        })
      );
      toast({
        title: "Klaida",
        description: "Nepavyko gauti prenumeruojamų kursų.",
        variant: "destructive",
      });
      setEnrolledCourses([]);
      setIsLoading(false);
    }
  }, [toast]);

  // Load profile data on mount
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      const loadProfileData = async () => {
        const profile = await getUserProfile();
        setProfileData(profile);

        profileForm.reset({
          username: profile?.username || "",
          email: user.email || "",
        });
      };

      loadProfileData();
      fetchSavedPublications();
      fetchEnrolledCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  // Profile submission handler
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileError(null);
    setSavingProfile(true);

    try {
      await updateUserProfile(data);
      toast({
        title: "Profilis atnaujintas",
        description: "Jūsų profilis buvo sėkmingai atnaujintas.",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Įvyko klaida atnaujinant profilį";
      setProfileError(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  // Password submission handler
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordError(null);
    setSavingPassword(true);

    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast({
        title: "Slaptažodis pakeistas",
        description: "Jūsų slaptažodis buvo sėkmingai pakeistas.",
      });
      passwordForm.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Įvyko klaida keičiant slaptažodį";
      setPasswordError(errorMessage);
    } finally {
      setSavingPassword(false);
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUploadedImage(reader.result as string);
        setShowCropDialog(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Image crop completion handler
  const handleCropComplete = async () => {
    if (!imageRef || !crop.width || !crop.height) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(
      async blob => {
        if (!blob) {
          toast({
            title: "Klaida",
            description: "Nepavyko konvertuoti nuotraukos",
            variant: "destructive",
          });
          return;
        }

        try {
          const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" });
          await uploadProfileImage(file);
          setShowCropDialog(false);

          toast({
            title: "Nuotrauka atnaujinta",
            description: "Jūsų profilio nuotrauka buvo sėkmingai atnaujinta.",
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Įvyko klaida įkeliant nuotrauką";
          toast({
            title: "Klaida",
            description: errorMessage,
            variant: "destructive",
          });
        }
      },
      "image/jpeg",
      0.95
    );
  };

  // Update notification setting
  const updateNotificationSetting = (key: keyof typeof emailNotifications, value: boolean) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: value,
    }));

    // TODO: Replace with actual API call
    toast({
      title: "Nustatymai atnaujinti",
      description: "Jūsų pranešimų nustatymai buvo sėkmingai atnaujinti.",
    });
  };

  return {
    // User and profile data
    user,
    loading,
    profileData,

    // Forms
    profileForm,
    passwordForm,

    // Error states
    profileError,
    passwordError,

    // Loading states
    savingProfile,
    savingPassword,
    isLoading,

    // Image cropping
    showCropDialog,
    setShowCropDialog,
    uploadedImage,
    crop,
    setCrop,
    imageRef,
    setImageRef,

    // Notification settings
    emailNotifications,

    // Activity data
    savedPublications,
    enrolledCourses,

    // Action handlers
    onProfileSubmit,
    onPasswordSubmit,
    handleImageUpload,
    handleCropComplete,
    updateNotificationSetting,
  };
};
