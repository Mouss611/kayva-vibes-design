import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-montserrat font-bold text-dark">
          kayva
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#permis" className="text-dark/80 hover:text-primary transition-colors">
            Permis de conduire
          </a>
          <a href="#code" className="text-dark/80 hover:text-primary transition-colors">
            Code de la route
          </a>
          <a href="/login" className="text-dark/80 hover:text-primary transition-colors flex items-center gap-2">
            <LogIn size={18} />
            Connexion
          </a>
          <Button className="gradient-bg text-white hover:opacity-90 transition-opacity">
            S'inscrire
          </Button>
        </nav>

        <Button className="md:hidden gradient-bg text-white hover:opacity-90 transition-opacity">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;