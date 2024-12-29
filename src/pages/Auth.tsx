import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GraduationCap, Car } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth = () => {
  const [role, setRole] = useState<"student" | "instructor">("student");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-secondary/50 to-white p-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <a href="/" className="text-3xl font-bold text-primary inline-block">
            kayva
          </a>
          <p className="text-gray-500">Votre parcours vers la réussite commence ici</p>
        </div>

        <div className="flex items-center justify-center gap-8 p-4">
          <div className="flex items-center gap-2">
            <Car className={`w-6 h-6 ${role === "student" ? "text-primary" : "text-gray-400"}`} />
            <Label htmlFor="role-switch" className="cursor-pointer">Élève</Label>
          </div>
          <Switch
            id="role-switch"
            checked={role === "instructor"}
            onCheckedChange={(checked) => setRole(checked ? "instructor" : "student")}
          />
          <div className="flex items-center gap-2">
            <GraduationCap className={`w-6 h-6 ${role === "instructor" ? "text-primary" : "text-gray-400"}`} />
            <Label htmlFor="role-switch" className="cursor-pointer">Moniteur</Label>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="register">S'inscrire</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm role={role} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm role={role} />
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500">
          <p>Besoin d'aide ? <a href="#" className="text-primary hover:underline">Contactez-nous</a></p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;