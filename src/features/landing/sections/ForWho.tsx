import { Card } from "@/shared/ui/card";
import { Store, Scissors, Stethoscope, Truck, Briefcase, Building2 } from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { useLanguage } from "@/shared/contexts/LanguageContext";

const businessIcons = [Store, Briefcase, Scissors, Stethoscope, Truck, Building2];

const ForWho = () => {
  const { t } = useLanguage();
  const businesses = t.landing.forWho.cards.map((business, index) => ({
    ...business,
    icon: businessIcons[index],
  }));

  return (
    <section id="for-who" className="py-20 bg-secondary/30" style={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.landing.forWho.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.landing.forWho.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <AnimatedCard key={index} index={index} baseDelay={80}>
                <Card className="p-6 h-full text-center bg-card border border-border">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-5 bg-primary/10 rounded-full">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {business.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {business.description}
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

export default ForWho;
