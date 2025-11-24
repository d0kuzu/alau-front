import { Card } from "@/components/ui/card";
import { Target, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              О нас
            </h2>
            <p className="text-xl text-muted-foreground">
              Мы делаем ИИ доступным для каждого бизнеса в Казахстане
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center border-2 border-border hover:border-primary/30 transition-all animate-fade-in-up">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Наша миссия
              </h3>
              <p className="text-muted-foreground">
                Сделать ИИ-технологии доступными для малого и среднего бизнеса
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-border hover:border-primary/30 transition-all animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Надёжность
              </h3>
              <p className="text-muted-foreground">
                Локальная поддержка и гарантия безопасности ваших данных
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-border hover:border-primary/30 transition-all animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Интеграции
              </h3>
              <p className="text-muted-foreground">
                SMS (основной канал), WhatsApp, Telegram, 1C, CRM, ERP и другие системы
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-primary/5 border-2 border-primary/20 animate-fade-in">
            <p className="text-lg text-foreground leading-relaxed text-center">
              <strong className="text-primary">alau.ai</strong> — это платформа нового поколения, 
              которая позволяет казахстанскому бизнесу использовать возможности 
              искусственного интеллекта без сложных настроек и огромных бюджетов. 
              Мы создаём умных агентов, которые работают за вас 24/7.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
