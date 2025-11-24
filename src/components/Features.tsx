import { Card } from "@/components/ui/card";
import { Headset, ShoppingCart, Settings, BarChart3 } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "ИИ-агенты для продаж",
    description: "Автоматизируйте обработку заказов, консультацию клиентов и увеличьте конверсию продаж.",
  },
  {
    icon: Headset,
    title: "ИИ-агенты для поддержки",
    description: "Мгновенные ответы на вопросы клиентов 24/7 через WhatsApp, Telegram и другие каналы.",
  },
  {
    icon: Settings,
    title: "Автоматизация процессов",
    description: "Интеграция с 1C, CRM, ERP системами для полной автоматизации бизнес-процессов.",
  },
  {
    icon: BarChart3,
    title: "Аналитика и данные",
    description: "Глубокая аналитика взаимодействий с клиентами и автоматическая обработка данных.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Возможности платформы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Умные ИИ-агенты для автоматизации любых бизнес-задач
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-border hover:border-primary/30 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
