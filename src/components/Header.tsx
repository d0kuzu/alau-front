import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: "smooth"
    });
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <span className="text-2xl font-bold text-foreground">
              Alau<span className="text-primary">.ai</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-foreground/80 hover:text-foreground transition-colors">
                {item.label}
              </button>)}
            <Button onClick={() => scrollToSection("contact")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              Связаться
            </Button>
          </nav>

          {/* Mobile Navigation */}
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
                
                <Button onClick={() => scrollToSection("contact")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg mt-4" size="lg">
                  Связаться
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>;
};
export default Header;