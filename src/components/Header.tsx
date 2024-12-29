import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-montserrat font-bold text-dark">
          kayva
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#permis" className="text-dark/80 hover:text-primary transition-colors">
            Permis de conduire
          </a>
          <a href="#code" className="text-dark/80 hover:text-primary transition-colors">
            Code de la route
          </a>
          <Link to="/auth" className="text-dark/80 hover:text-primary transition-colors flex items-center gap-2">
            <LogIn size={18} />
            Connexion
          </Link>
          <Link to="/auth?tab=register">
            <Button className="gradient-bg text-white hover:opacity-90 transition-opacity">
              S'inscrire
            </Button>
          </Link>
        </nav>

        <Button className="md:hidden gradient-bg text-white hover:opacity-90 transition-opacity">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;