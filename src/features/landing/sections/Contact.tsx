import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCard from "../components/AnimatedCard";
import { useLanguage } from "@/shared/contexts/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t.landing.contact.toastTitle,
      description: t.landing.contact.toastDescription,
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.landing.contact.title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t.landing.contact.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <AnimatedCard index={0}>
              <Card className="p-4 md:p-6 text-center border-2 border-border h-full">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                <a
                  href="https://wa.me/77000000000"
                  className="text-primary hover:underline text-sm md:text-base"
                >
                  +7 700 000 00 00
                </a>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={1}>
              <Card className="p-4 md:p-6 text-center border-2 border-border h-full">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <a
                  href="mailto:hello@zerde.ai"
                  className="text-primary hover:underline text-sm md:text-base"
                >
                  hello@zerde.ai
                </a>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={2}>
              <Card className="p-4 md:p-6 text-center border-2 border-border h-full">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                    <Send className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Telegram</h3>
                <a
                  href="https://t.me/alauai"
                  className="text-primary hover:underline text-sm md:text-base"
                >
                  @alauai
                </a>
              </Card>
            </AnimatedCard>
          </div>

          <AnimatedCard index={3}>
            <Card className="p-5 md:p-8 border-2 border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder={t.landing.contact.namePlaceholder}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-12 border-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-12 border-2"
                />
                <Input
                  type="tel"
                  placeholder={t.landing.contact.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-12 border-2"
                />
              </div>

              <Textarea
                placeholder={t.landing.contact.messagePlaceholder}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="min-h-32 border-2"
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
              >
                {t.landing.contact.submit}
              </Button>
            </form>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;
