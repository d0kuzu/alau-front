import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import heroBgVideo from "@/assets/hero-bg.mp4";

interface HeroProps {
  onVideoLoad?: () => void;
}

const Hero = ({ onVideoLoad }: HeroProps) => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/30 to-background pt-16 md:pt-20">
      {/* Video background */}
      <div className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          onLoadedData={onVideoLoad}
          className="w-full h-full object-cover opacity-60"
        >
          <source src={heroBgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/90" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
            AI-агенты, которые работают за вас
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
            Автоматизация бизнеса через SMS, WhatsApp и Telegram с помощью умных ИИ-решений
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-xl shadow-lg transition-colors group"
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
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-xl border-2 border-primary/20"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </div>

      {/* Floating elements - hidden on mobile */}
      <div className="hidden sm:block absolute bottom-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
      <div className="hidden sm:block absolute top-40 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </section>
  );
};

export default Hero;
