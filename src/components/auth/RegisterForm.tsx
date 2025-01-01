import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import CommonFields from "./forms/CommonFields";
import InstructorFields from "./forms/InstructorFields";
import PrivacyNotice from "./forms/PrivacyNotice";

interface RegisterFormProps {
  role: "student" | "instructor";
}

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  employmentStatus?: string;
  postalCode?: string;
  city?: string;
  preferredLocation?: string;
  teachingHours?: string;
}

const RegisterForm = ({ role }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      employmentStatus: "",
      postalCode: "",
      city: "",
      preferredLocation: "",
      teachingHours: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: role,
            phone_number: data.phoneNumber,
            employment_status: data.employmentStatus,
            postal_code: data.postalCode,
            city: data.city,
            preferred_location: data.preferredLocation,
            teaching_hours: data.teachingHours,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CommonFields form={form} />
        {role === "instructor" && <InstructorFields form={form} />}

        <Button
          type="submit"
          className="w-full gradient-bg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            "Je m'inscris"
          )}
        </Button>

        <PrivacyNotice />
      </form>
    </Form>
  );
};

export default RegisterForm;