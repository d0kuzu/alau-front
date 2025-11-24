import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/30 to-background pt-20">
      {/* Multi-layer mountain background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Back layer - distant mountains */}
          <path
            d="M0 600L120 480L240 520L360 420L480 460L600 380L720 440L840 360L960 400L1080 340L1200 380V600H0Z"
            fill="currentColor"
            className="text-primary"
            opacity="0.3"
          />
          {/* Middle layer */}
          <path
            d="M0 600L100 500L200 520L350 400L500 440L650 360L800 420L950 340L1100 380L1200 340V600H0Z"
            fill="currentColor"
            className="text-primary"
            opacity="0.5"
          />
          {/* Front layer - prominent peaks */}
          <path
            d="M0 600L150 450L300 500L450 350L600 400L750 250L900 350L1050 200L1200 300V600H0Z"
            fill="currentColor"
            className="text-primary"
            opacity="0.8"
          />
        </svg>
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
