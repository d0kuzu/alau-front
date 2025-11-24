import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import mountainsBg from "@/assets/mountains-bg.png";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/30 to-background pt-20">
      {/* Real mountains background */}
      <div className="absolute inset-0">
        <img 
          src={mountainsBg} 
          alt="" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background/80" />
      </div>

      {/* Logo as decorative element with parallax */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 opacity-8 animate-float pointer-events-none">
        <img 
          src={logo} 
          alt="" 
          className="w-full h-full object-contain filter blur-[2px]"
          style={{ transform: "translateZ(0)" }}
        />
      </div>
      
      <div className="absolute top-1/3 left-[8%] w-48 h-48 opacity-6 animate-float pointer-events-none" style={{ animationDelay: "2s" }}>
        <img 
          src={logo} 
          alt="" 
          className="w-full h-full object-contain filter blur-[3px]"
          style={{ transform: "translateZ(0)" }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            AI-агенты, которые работают за вас
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Автоматизация бизнеса через SMS, WhatsApp и Telegram с помощью умных ИИ-решений
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
            >
              Попробовать бесплатно
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-xl border-2 border-primary/20 hover:border-primary/40"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </section>
  );
};

export default Hero;
