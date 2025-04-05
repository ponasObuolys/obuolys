
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Neteisingas el. pašto formatas'),
  password: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
});

const signupSchema = z.object({
  email: z.string().email('Neteisingas el. pašto formatas'),
  username: z.string().min(3, 'Vartotojo vardas turi būti bent 3 simbolių'),
  password: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
  confirmPassword: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Slaptažodžiai nesutampa",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      await signIn(data.email, data.password);
      navigate('/');
    } catch (error: any) {
      setAuthError(error.message || 'Įvyko klaida prisijungiant');
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setAuthError(null);
    try {
      await signUp(data.email, data.password, data.username);
      setActiveTab('login');
    } catch (error: any) {
      setAuthError(error.message || 'Įvyko klaida registruojantis');
    }
  };

  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Prisijungimas</TabsTrigger>
              <TabsTrigger value="signup">Registracija</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Prisijungimas</CardTitle>
                  <CardDescription>
                    Prisijunkite prie savo paskyros įvesdami el. paštą ir slaptažodį.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {authError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
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
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slaptažodis</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                        Prisijungti
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Registracija</CardTitle>
                  <CardDescription>
                    Sukurkite naują paskyrą įvesdami savo duomenis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {authError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
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
                      <FormField
                        control={signupForm.control}
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
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slaptažodis</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pakartokite slaptažodį</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={signupForm.formState.isSubmitting}>
                        Registruotis
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Auth;
