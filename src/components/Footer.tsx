import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return (
    <footer className="bg-secondary/30 border-t border-border py-8 md:py-12" style={{
      backgroundColor: 'rgba(247, 247, 247, 1)'
    }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center md:gap-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <button 
              onClick={() => navigate("/")} 
              className="text-lg md:text-xl font-bold text-foreground hover:opacity-80 transition-opacity cursor-pointer"
            >
              Alau<span className="text-primary">.ai</span>
            </button>
          </div>

          <div className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
            ©Alau.ai. Все права защищены. 
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;