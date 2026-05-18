import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import LanguageSelector from "@/shared/components/LanguageSelector";

const accountBlueButtonStyle = {
  color: 'rgba(240, 240, 240, 1)',
  backgroundColor: 'rgba(81, 194, 251, 1)',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'rgba(81, 194, 251, 1)'
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const {
    user,
    profile,
    isAuthenticated,
    signOut
  } = useAuth();

  // Получаем имя из профиля или логин из email
  const getUserDisplayName = () => {
    if (profile?.name) return profile.name;
    if (user?.email) return user.email.split('@')[0];
    return t.common.userFallback;
  };
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
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
    label: t.header.nav.features
  }, {
    id: "for-who",
    label: t.header.nav.forWho
  }, {
    id: "about",
    label: t.header.nav.about
  }, {
    id: "pricing",
    label: t.header.nav.pricing
  }];

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' 
      : 'bg-transparent'
  }`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity cursor-pointer">
            Alau<span className="text-primary">.ai</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 text-left whitespace-nowrap flex-nowrap">
            {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap">
                {item.label}
              </button>)}
          </nav>

          {/* Right side: Account button, Contact button (desktop) and Mobile menu */}
          <div className="flex justify-end items-center gap-4">
            <LanguageSelector />
            {isAuthenticated && user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center px-3" style={{
                ...accountBlueButtonStyle
              }}>
                    <span className="inline-flex items-center justify-center gap-2 leading-none">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="block font-medium leading-none">{getUserDisplayName()}</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{getUserDisplayName()}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t.header.account}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.header.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button onClick={() => navigate("/auth")} variant="ghost" size="icon" className="hidden md:flex" style={{
            ...accountBlueButtonStyle
          }}>
                <User className="h-5 w-5" />
              </Button>}
            <Button onClick={() => scrollToSection("contact")} className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg whitespace-nowrap">
              {t.header.contact}
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden ml-2">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    
                    <span className="text-xl font-bold text-foreground">
                      Alau<span className="text-primary">.ai</span>
                    </span>
                  </div>
                  
                  {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-lg text-foreground/80 hover:text-foreground transition-colors text-left py-2 border-b border-border/50">
                      {item.label}
                    </button>)}

                  <LanguageSelector fullWidth className="mt-1" />
                  
                  {isAuthenticated && user ? <>
                      <div className="px-2 py-2 border-b border-border/50">
                        <div className="font-medium text-foreground">{getUserDisplayName()}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <Button onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }} variant="ghost" className="text-lg text-foreground/80 hover:text-foreground transition-colors text-left py-2 border-b border-border/50 justify-start">
                        <User className="h-5 w-5 mr-2" />
                        {t.header.account}
                      </Button>
                      <Button onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} variant="ghost" className="text-lg text-foreground/80 hover:text-foreground transition-colors text-left py-2 border-b border-border/50 justify-start">
                        <LogOut className="h-5 w-5 mr-2" />
                        {t.header.logout}
                      </Button>
                    </> : <Button onClick={() => navigate("/auth")} variant="ghost" className="text-lg text-foreground/80 hover:text-foreground transition-colors text-left py-2 border-b border-border/50 justify-start">
                      <User className="h-5 w-5 mr-2" />
                      {t.header.loginRegister}
                    </Button>}
                  
                  <Button onClick={() => scrollToSection("contact")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg mt-4" size="lg">
                    {t.header.contact}
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
