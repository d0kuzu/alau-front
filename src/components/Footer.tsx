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
  return <footer className="bg-secondary/30 border-t border-border py-12" style={{
    backgroundColor: 'rgba(247, 247, 247, 1)'
  }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity cursor-pointer">
              Alau<span className="text-primary">.ai</span>
            </button>
          </div>

          

          <div className="text-sm text-muted-foreground">
            ©Alau.ai. Все права защищены. 
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;