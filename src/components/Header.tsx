import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };
  const navItems = [{
    id: "features",
    label: "Возможности"
  }, {
    id: "for-who",
    label: "Для кого"
  }, {
    id: "about",
    label: "О нас"
  }, {
    id: "pricing",
    label: "Цены"
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            
            <span className="text-2xl font-bold text-foreground">
              Alau<span className="text-primary">.ai</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 text-left whitespace-nowrap flex-nowrap">
            {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap">
                {item.label}
              </button>)}
          </nav>

          {/* Right side: Account button, Contact button (desktop) and Mobile menu */}
          <div className="flex justify-end items-center gap-4">
            <Button 
              onClick={() => navigate("/auth")} 
              variant="ghost" 
              size="icon"
              className="hidden md:flex"
              style={{ 
                color: 'rgba(240, 240, 240, 1)', 
                backgroundColor: 'rgba(81, 194, 251, 1)', 
                borderStyle: 'solid', 
                borderWidth: '1px', 
                borderColor: 'rgba(81, 194, 251, 1)'
              }}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button onClick={() => scrollToSection("contact")} className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg whitespace-nowrap">
              Связаться
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={logo} alt="Alau.ai" className="h-8 w-auto brightness-0 invert-0 sepia saturate-[10] hue-rotate-[170deg]" />
                    <span className="text-xl font-bold text-foreground">
                      Alau<span className="text-primary">.ai</span>
                    </span>
                  </div>
                  
                  {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-lg text-foreground/80 hover:text-foreground transition-colors text-left py-2 border-b border-border/50">
                      {item.label}
                    </button>)}
                  
                  <Button 
                    onClick={() => navigate("/auth")} 
                    variant="ghost"
                    className="text-lg text-foreground/80 hover:text-foreground transition-colors text-left py-2 border-b border-border/50 justify-start"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Вход / Регистрация
                  </Button>
                  
                  <Button onClick={() => scrollToSection("contact")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg mt-4" size="lg">
                    Связаться
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;