import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is an instructor
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileData?.role !== "instructor") {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Moniteur</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards for future features */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Élèves</h2>
          <p className="text-gray-600">Gérez vos élèves et leur progression</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Planning</h2>
          <p className="text-gray-600">Consultez et gérez votre emploi du temps</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Revenus</h2>
          <p className="text-gray-600">Suivez vos revenus et statistiques</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;