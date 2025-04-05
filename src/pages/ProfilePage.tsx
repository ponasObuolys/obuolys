import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Schemos duomenų validacijai
const profileSchema = z.object({
  username: z.string().min(3, 'Vartotojo vardas turi būti bent 3 simbolių'),
  email: z.string().email('Neteisingas el. pašto formatas'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
  newPassword: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
  confirmPassword: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Slaptažodžiai nesutampa",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { user, loading, updateUserProfile, updatePassword, uploadProfileImage } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  // Nuotraukos apkarpymo būsenos
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  
  // Pranešimų nustatymai
  const [emailNotifications, setEmailNotifications] = useState({
    newsletter: true,
    comments: true,
    courseUpdates: true,
    publicationUpdates: true
  });
  
  // Išsaugotos publikacijos ir kursai
  const [savedPublications, setSavedPublications] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Užkraunami vartotojo duomenys
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      // Užpildyti formą vartotojo duomenimis
      profileForm.reset({
        username: user.username || '',
        email: user.email || '',
      });

      // Gauti išsaugotas publikacijas (pavyzdinis kodas)
      fetchSavedPublications();
      
      // Gauti kursų prenumeratas (pavyzdinis kodas)
      fetchEnrolledCourses();
    }
  }, [user, loading]);

  // Pavyzdinė funkcija išsaugotoms publikacijoms gauti
  const fetchSavedPublications = async () => {
    setIsLoading(true);
    try {
      // API užklausa išsaugotoms publikacijoms gauti
      // const response = await fetch('/api/saved-publications');
      // const data = await response.json();
      // setSavedPublications(data);
      
      // Laikinas pavyzdinis kodas
      setTimeout(() => {
        setSavedPublications([
          { id: 1, title: 'Mokslinė publikacija 1', date: '2025-03-01', image: '/images/publication1.jpg' },
          { id: 2, title: 'Straipsnis apie biologiją', date: '2025-02-15', image: '/images/publication2.jpg' },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Klaida gaunant išsaugotas publikacijas:', error);
      setIsLoading(false);
    }
  };

  // Pavyzdinė funkcija prenumeruojamiems kursams gauti
  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    try {
      // API užklausa kursams gauti
      // const response = await fetch('/api/enrolled-courses');
      // const data = await response.json();
      // setEnrolledCourses(data);
      
      // Laikinas pavyzdinis kodas
      setTimeout(() => {
        setEnrolledCourses([
          { id: 1, title: 'Biologija pradedantiesiems', progress: 60, image: '/images/course1.jpg' },
          { id: 2, title: 'Genomikos pagrindai', progress: 25, image: '/images/course2.jpg' },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Klaida gaunant prenumeruojamus kursus:', error);
      setIsLoading(false);
    }
  };

  // Profilio atnaujinimas
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileError(null);
    setSavingProfile(true);
    
    try {
      // Čia būtų tikras API kvietimas atnaujinti vartotojo profilį
      await updateUserProfile(data);
      
      toast({
        title: "Profilis atnaujintas",
        description: "Jūsų profilis buvo sėkmingai atnaujintas."
      });
    } catch (error: any) {
      setProfileError(error.message || 'Įvyko klaida atnaujinant profilį');
    } finally {
      setSavingProfile(false);
    }
  };

  // Slaptažodžio keitimas
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordError(null);
    setSavingPassword(true);
    
    try {
      // Čia būtų tikras API kvietimas keisti slaptažodį
      await updatePassword(data.currentPassword, data.newPassword);
      
      toast({
        title: "Slaptažodis pakeistas",
        description: "Jūsų slaptažodis buvo sėkmingai pakeistas."
      });
      
      // Išvalyti formą
      passwordForm.reset();
    } catch (error: any) {
      setPasswordError(error.message || 'Įvyko klaida keičiant slaptažodį');
    } finally {
      setSavingPassword(false);
    }
  };

  // Nuotraukos pasirinkimas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUploadedImage(reader.result as string);
        setShowCropDialog(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Nuotraukos apkarpymo ir išsaugojimo funkcija
  const handleCropComplete = async () => {
    if (!imageRef || !crop.width || !crop.height) return;
    
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    const ctx = canvas.getContext('2d');
    
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
    
    // Konvertuojame į base64 ir išsaugome
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast({
          title: "Klaida",
          description: "Nepavyko konvertuoti nuotraukos",
          variant: "destructive"
        });
        return;
      }
      
      try {
        // Konvertuojame blob į File objektą
        const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });
        
        // Įkeliame nuotrauką naudodami AuthContext funkciją
        await uploadProfileImage(file);
        
        // Uždarome apkarpymo dialogą
        setShowCropDialog(false);
        
        // Pranešame vartotojui
        toast({
          title: "Nuotrauka atnaujinta",
          description: "Jūsų profilio nuotrauka buvo sėkmingai atnaujinta."
        });
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: error.message || "Įvyko klaida įkeliant nuotrauką",
          variant: "destructive"
        });
      }
    }, 'image/jpeg', 0.95);
  };

  // Pranešimo nustatymų keitimas
  const updateNotificationSetting = (key: keyof typeof emailNotifications, value: boolean) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Čia būtų tikras API kvietimas išsaugoti pranešimų nustatymus
    // saveNotificationSettings({ ...emailNotifications, [key]: value });
    
    toast({
      title: "Nustatymai atnaujinti",
      description: "Jūsų pranešimų nustatymai buvo sėkmingai atnaujinti."
    });
  };

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
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.username || 'Vartotojas'} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'V'}</AvatarFallback>
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
                    {savingProfile ? 'Išsaugoma...' : 'Išsaugoti pakeitimus'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Veiklos kortelė */}
        <TabsContent value="activity">
          <div className="grid grid-cols-1 gap-6">
            {/* Išsaugotos publikacijos */}
            <Card>
              <CardHeader>
                <CardTitle>Išsaugotos publikacijos</CardTitle>
                <CardDescription>
                  Jūsų išsaugotos ir pamėgtos publikacijos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Kraunama...</p>
                ) : savedPublications.length === 0 ? (
                  <p className="text-muted-foreground">Neturite išsaugotų publikacijų</p>
                ) : (
                  <div className="space-y-4">
                    {savedPublications.map((pub: any) => (
                      <div key={pub.id} className="flex items-center space-x-4 p-4 border rounded-md">
                        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                          <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{pub.title}</h3>
                          <p className="text-sm text-muted-foreground">{pub.date}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Peržiūrėti
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Prenumeruojami kursai */}
            <Card>
              <CardHeader>
                <CardTitle>Kursų prenumeratos</CardTitle>
                <CardDescription>
                  Jūsų prenumeruojami kursai ir mokymosi progresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Kraunama...</p>
                ) : enrolledCourses.length === 0 ? (
                  <p className="text-muted-foreground">Neturite prenumeruojamų kursų</p>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((course: any) => (
                      <div key={course.id} className="p-4 border rounded-md">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">Progresas: {course.progress}%</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Tęsti
                          </Button>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Saugumo kortelė */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Slaptažodžio keitimas</CardTitle>
              <CardDescription>
                Atnaujinkite savo paskyros slaptažodį
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dabartinis slaptažodis</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naujas slaptažodis</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pakartokite naują slaptažodį</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="mt-4" disabled={savingPassword}>
                    {savingPassword ? 'Keičiama...' : 'Pakeisti slaptažodį'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pranešimų kortelė */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>El. pašto pranešimai</CardTitle>
              <CardDescription>
                Valdykite, kokius el. pašto pranešimus norite gauti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="newsletter" className="flex flex-col space-y-1">
                  <span>Naujienlaiškiai</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Gaukite reguliarius naujienlaiškius apie naujas publikacijas
                  </span>
                </Label>
                <Switch
                  id="newsletter"
                  checked={emailNotifications.newsletter}
                  onCheckedChange={(checked) => updateNotificationSetting('newsletter', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="comments" className="flex flex-col space-y-1">
                  <span>Komentarų pranešimai</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Gaukite pranešimus, kai kas nors pakomentuoja jūsų turinį ar atsako į jūsų komentarus
                  </span>
                </Label>
                <Switch
                  id="comments"
                  checked={emailNotifications.comments}
                  onCheckedChange={(checked) => updateNotificationSetting('comments', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="courseUpdates" className="flex flex-col space-y-1">
                  <span>Kursų atnaujinimai</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Gaukite pranešimus apie jūsų prenumeruojamų kursų atnaujinimus
                  </span>
                </Label>
                <Switch
                  id="courseUpdates"
                  checked={emailNotifications.courseUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('courseUpdates', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="publicationUpdates" className="flex flex-col space-y-1">
                  <span>Publikacijų atnaujinimai</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Gaukite pranešimus apie naujus straipsnius ir publikacijas
                  </span>
                </Label>
                <Switch
                  id="publicationUpdates"
                  checked={emailNotifications.publicationUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('publicationUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Nuotraukos apkarpymo dialogas */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="crop-dialog-description">
          <DialogHeader>
            <DialogTitle>Apkarpykite profilio nuotrauką</DialogTitle>
          </DialogHeader>
          <p id="crop-dialog-description" className="text-sm text-muted-foreground mb-2">
            Apkarpykite savo profilio nuotrauką. Rekomenduojama kvadratinė forma.
          </p>
          <div className="py-4">
            {uploadedImage && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                circularCrop
                aspect={1}
              >
                <img 
                  src={uploadedImage} 
                  alt="Apkarpoma nuotrauka"
                  onLoad={(e) => setImageRef(e.currentTarget)}
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCropDialog(false)}>
              Atšaukti
            </Button>
            <Button type="button" onClick={handleCropComplete}>
              Išsaugoti
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
