import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

const Onboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if onboarding is already completed
      const { data: onboardingData } = await supabase
        .from("student_onboarding")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single();

      if (onboardingData?.onboarding_completed) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  return <OnboardingFlow />;
};

export default Onboarding;