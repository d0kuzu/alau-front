import { Card } from "@/shared/ui/card";
import { Headset, ShoppingCart, Settings, BarChart3 } from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "@/shared/contexts/LanguageContext";

const featureIcons = [ShoppingCart, Headset, Settings, BarChart3];

const Features = () => {
  const { t } = useLanguage();
  const features = t.landing.features.cards.map((feature, index) => ({
    ...feature,
    icon: featureIcons[index],
  }));

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.landing.features.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.landing.features.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedCard key={index} index={index}>
                <Card className="p-8 h-full border-2 border-border">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl flex-shrink-0">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
