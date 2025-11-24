import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="alau.ai" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-foreground">alau.ai</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Возможности
            </button>
            <button
              onClick={() => scrollToSection("for-who")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Для кого
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              О нас
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Цены
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              Связаться
            </Button>
          </nav>

          <Button
            onClick={() => scrollToSection("contact")}
            className="md:hidden bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Связаться
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
