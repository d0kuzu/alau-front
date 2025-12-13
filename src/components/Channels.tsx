import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MessageCircle, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCard from "@/components/AnimatedCard";

const channels = [
  {
    icon: MessageSquare,
    name: "SMS",
    badge: "Основной канал",
    description: "Главная платформа для работы ИИ-агентов. Доступность 100%, работает на любом телефоне.",
    featured: false,
  },
  {
    icon: MessageCircle,
    name: "WhatsApp",
    description: "Автоматизация заказов, консультаций и обработка запросов клиентов через популярный мессенджер.",
    featured: false,
  },
  {
    icon: Send,
    name: "Telegram",
    description: "Мгновенная поддержка клиентов и уведомления через быстрый и удобный канал связи.",
    featured: false,
  },
];

const Channels = () => {
  return (
    <section id="channels" className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Работаем на всех популярных платформах
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ваши клиенты могут связаться с ИИ-агентами удобным для них способом
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <AnimatedCard key={index} index={index} baseDelay={150}>
                <Card
                  className={`p-8 transition-all duration-300 hover:-translate-y-2 h-full ${
                    channel.featured
                      ? "md:scale-110 border-2 border-border hover:border-primary shadow-xl hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
                      : "border-2 border-border hover:border-primary/30 hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className={`p-6 rounded-3xl ${
                        channel.featured
                          ? "bg-primary/20"
                          : "bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`text-primary ${
                          channel.featured ? "w-12 h-12" : "w-10 h-10"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <h3
                          className={`font-bold text-foreground ${
                            channel.featured ? "text-3xl" : "text-2xl"
                          }`}
                        >
                          {channel.name}
                        </h3>
                      </div>
                      
                      {channel.badge && (
                        <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">
                          ⭐ {channel.badge}
                        </Badge>
                      )}
                      
                      <p className={`text-muted-foreground leading-relaxed ${
                        channel.featured ? "text-base" : "text-sm"
                      }`}>
                        {channel.description}
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

export default Channels;