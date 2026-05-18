import { Card } from "@/shared/ui/card";
import { Target, Shield, Zap } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCard from "../components/AnimatedCard";
import { useLanguage } from "@/shared/contexts/LanguageContext";

const aboutIcons = [Target, Shield, Zap];

const About = () => {
  const { t } = useLanguage();
  const aboutCards = t.landing.about.cards.map((card, index) => ({
    ...card,
    icon: aboutIcons[index],
  }));

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.landing.about.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.landing.about.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aboutCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <AnimatedCard key={index} index={index} baseDelay={150}>
                  <Card className="p-6 text-center border-2 border-border h-full">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {card.description}
                    </p>
                  </Card>
                </AnimatedCard>
              );
            })}
          </div>

          <AnimatedSection delay={400}>
            <Card className="p-8 bg-primary/5 border-2 border-primary/20">
              <p className="text-lg text-foreground leading-relaxed text-center">
                <strong className="text-primary">Alau.ai</strong> {t.landing.about.paragraph}
              </p>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
