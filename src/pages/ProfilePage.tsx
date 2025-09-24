import { ActivityTab } from "@/components/profile/ActivityTab";
import { NotificationsTab } from "@/components/profile/NotificationsTab";
import { ProfileInformationTab } from "@/components/profile/ProfileInformationTab";
import { SecurityTab } from "@/components/profile/SecurityTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileManagement } from "@/hooks/useProfileManagement";
import { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const {
    // User and loading state
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
  } = useProfileManagement();

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <p>Kraunama...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Mano profilis</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profilis</TabsTrigger>
          <TabsTrigger value="activity">Veikla</TabsTrigger>
          <TabsTrigger value="security">Saugumas</TabsTrigger>
          <TabsTrigger value="notifications">Pranešimai</TabsTrigger>
        </TabsList>

        {/* Profilio informacijos kortelė */}
        <TabsContent value="profile">
          <ProfileInformationTab
            profileData={profileData}
            profileForm={profileForm}
            profileError={profileError}
            savingProfile={savingProfile}
            onProfileSubmit={onProfileSubmit}
            handleImageUpload={handleImageUpload}
            showCropDialog={showCropDialog}
            setShowCropDialog={setShowCropDialog}
            uploadedImage={uploadedImage}
            crop={crop}
            setCrop={setCrop}
            imageRef={imageRef}
            setImageRef={setImageRef}
            handleCropComplete={handleCropComplete}
          />
        </TabsContent>

        {/* Veiklos kortelė */}
        <TabsContent value="activity">
          <ActivityTab
            savedPublications={savedPublications}
            enrolledCourses={enrolledCourses}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Saugumo kortelė */}
        <TabsContent value="security">
          <SecurityTab
            passwordForm={passwordForm}
            passwordError={passwordError}
            savingPassword={savingPassword}
            onPasswordSubmit={onPasswordSubmit}
          />
        </TabsContent>

        {/* Pranešimų kortelė */}
        <TabsContent value="notifications">
          <NotificationsTab
            emailNotifications={emailNotifications}
            updateNotificationSetting={updateNotificationSetting}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
