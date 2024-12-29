import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = (role: "student" | "instructor") => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (role === "student") {
        const { data: onboardingData } = await supabase
          .from("student_onboarding")
          .select("onboarding_completed")
          .eq("id", user?.id)
          .maybeSingle();

        if (!onboardingData?.onboarding_completed) {
          navigate("/onboarding");
          return;
        }

        navigate("/dashboard/student");
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers votre tableau de bord",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};