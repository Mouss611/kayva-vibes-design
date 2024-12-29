import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import InstructorOnboardingFlow from "@/components/onboarding/InstructorOnboardingFlow";

const InstructorOnboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if onboarding is already completed
      const { data: profileData } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single();

      if (profileData?.onboarding_completed) {
        navigate("/dashboard/instructor");
      }
    };

    checkAuth();
  }, [navigate]);

  return <InstructorOnboardingFlow />;
};

export default InstructorOnboarding;