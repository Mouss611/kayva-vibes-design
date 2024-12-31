import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Offers from "@/components/Offers";
import QuestionsSection from "@/components/QuestionsSection";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    // Handle payment status messages
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Paiement réussi",
        description: "Votre abonnement a été activé avec succès.",
      });
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        variant: "destructive",
        title: "Paiement annulé",
        description: "Le processus de paiement a été annulé. Vous pouvez réessayer quand vous voulez.",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord élève</h1>
        
        {/* Questions section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Questions d'entraînement</h2>
          <QuestionsSection />
        </div>

        {/* Current status cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
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

        {/* Subscription section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nos formules</h2>
          <p className="text-gray-600 mb-8">
            Choisissez la formule qui vous convient le mieux pour commencer votre apprentissage
          </p>
          <Offers />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;