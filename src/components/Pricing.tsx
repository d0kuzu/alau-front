import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import AnimatedCard from "./AnimatedCard";

const plans = [
  {
    name: "Стартовый",
    price: "100 000 ₸",
    period: "в месяц",
    features: [
      "1 ИИ-агент",
      "До 1000 обращений/месяц",
      "Интеграция WhatsApp или Telegram",
      "Базовая аналитика",
      "Email поддержка",
    ],
  },
  {
    name: "Бизнес",
    price: "149 000 ₸",
    period: "в месяц",
    popular: true,
    features: [
      "До 5 ИИ-агентов",
      "До 5000 обращений/месяц",
      "Все каналы связи",
      "Интеграция с 1C/CRM",
      "Продвинутая аналитика",
      "Приоритетная поддержка",
    ],
  },
  {
    name: "Корпоративный",
    price: "Индивидуально",
    period: "",
    features: [
      "Неограниченное количество агентов",
      "Неограниченные обращения",
      "Все интеграции",
      "Персональный менеджер",
      "SLA гарантии",
      "Кастомные разработки",
    ],
  },
];

const Pricing = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-12 md:py-20 bg-secondary/30" style={{ backgroundColor: 'rgba(247, 248, 248, 1)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Простые и понятные тарифы
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий план для вашего бизнеса
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <AnimatedCard key={index} index={index} baseDelay={150}>
              <Card
                className={`p-6 md:p-8 h-full relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-primary shadow-lg md:scale-105"
                    : "border border-border hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Популярный
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-1">
                    {plan.price}
                  </div>
                  <div className="text-muted-foreground">{plan.period}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-foreground"
                    >
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={scrollToContact}
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                >
                  Выбрать план
                </Button>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Нужна консультация? Мы поможем подобрать оптимальный тариф
          </p>
          <Button
            onClick={scrollToContact}
            variant="outline"
            className="border-2 border-primary/20 hover:border-primary/40"
          >
            Связаться с нами
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
