import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const StudentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if onboarding is completed
      const { data: onboardingData } = await supabase
        .from("student_onboarding")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!onboardingData?.onboarding_completed) {
        navigate("/onboarding");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord élève</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards for future dashboard content */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Mes cours</h2>
          <p className="text-gray-600">Aucun cours planifié pour le moment</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Mon progression</h2>
          <p className="text-gray-600">Commencez vos cours pour suivre votre progression</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Mes documents</h2>
          <p className="text-gray-600">Aucun document disponible</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;