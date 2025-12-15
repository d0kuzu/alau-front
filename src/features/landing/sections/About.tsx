import { Card } from "@/shared/ui/card";
import { Target, Shield, Zap } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCard from "../components/AnimatedCard";

const aboutCards = [
  {
    icon: Target,
    title: "Наша миссия",
    description: "Сделать ИИ-технологии доступными для малого и среднего бизнеса",
  },
  {
    icon: Shield,
    title: "Надёжность",
    description: "Локальная поддержка и гарантия безопасности ваших данных",
  },
  {
    icon: Zap,
    title: "Интеграции",
    description: "SMS (основной канал), WhatsApp, Telegram, 1C, CRM, ERP и другие системы",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              О нас
            </h2>
            <p className="text-xl text-muted-foreground">
              Мы делаем ИИ доступным для каждого бизнеса в Казахстане
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aboutCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <AnimatedCard key={index} index={index} baseDelay={150}>
                  <Card className="p-6 text-center border-2 border-border hover:border-primary/30 transition-all h-full">
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
                <strong className="text-primary">Alau.ai</strong> — это платформа нового поколения, 
                которая позволяет казахстанскому бизнесу использовать возможности 
                искусственного интеллекта без сложных настроек и огромных бюджетов. 
                Мы создаём умных агентов, которые работают за вас 24/7.
              </p>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
