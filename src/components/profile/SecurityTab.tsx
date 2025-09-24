import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type PasswordFormValues } from "@/hooks/useProfileManagement";

interface SecurityTabProps {
  passwordForm: UseFormReturn<PasswordFormValues>;
  passwordError: string | null;
  savingPassword: boolean;
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
}

export const SecurityTab = ({
  passwordForm,
  passwordError,
  savingPassword,
  onPasswordSubmit,
}: SecurityTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Slaptažodžio keitimas</CardTitle>
        <CardDescription>Atnaujinkite savo paskyros slaptažodį</CardDescription>
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
              {savingPassword ? "Keičiama..." : "Pakeisti slaptažodį"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
