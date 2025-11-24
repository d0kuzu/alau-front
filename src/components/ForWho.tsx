import { Card } from "@/components/ui/card";
import { Store, Scissors, Stethoscope, Truck, Briefcase, Building2 } from "lucide-react";

const businesses = [
  {
    icon: Store,
    title: "Магазины и ритейл",
    description: "Автоматизация продаж и обработка заказов",
  },
  {
    icon: Briefcase,
    title: "Услуги",
    description: "Запись клиентов и консультации",
  },
  {
    icon: Scissors,
    title: "Салоны красоты",
    description: "Онлайн-запись и напоминания",
  },
  {
    icon: Stethoscope,
    title: "Медицинские центры",
    description: "Запись на приём и поддержка пациентов",
  },
  {
    icon: Truck,
    title: "Логистика",
    description: "Отслеживание заказов и уведомления",
  },
  {
    icon: Building2,
    title: "SMB-компании",
    description: "Полная автоматизация процессов",
  },
];

const ForWho = () => {
  return (
    <section id="for-who" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Для кого alau.ai?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Решения для любого бизнеса в Казахстане
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border border-border hover:border-primary/30 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ForWho;
