import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleAgreePrivacy = () => {
    setShowPrivacy(false);
  };

  const handleAgreeTerms = () => {
    setShowTerms(false);
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/50" style={{
        backgroundColor: 'rgba(247, 247, 247, 1)'
      }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="text-sm text-muted-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:underline decoration-primary/50 underline-offset-4"
            >
              Политика конфиденциальности
            </button>
            <span className="text-muted-foreground/40 text-lg">•</span>
            <span className="text-sm text-muted-foreground/80 font-medium tracking-wide">
              © 2024 Alau.ai. Все права защищены.
            </span>
            <span className="text-muted-foreground/40 text-lg">•</span>
            <button 
              onClick={() => setShowTerms(true)}
              className="text-sm text-muted-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:underline decoration-primary/50 underline-offset-4"
            >
              Условия использования
            </button>
          </div>
        </div>
      </footer>

      {/* Модальное окно Политики конфиденциальности */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground">Политика конфиденциальности</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[55vh] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="text-lg font-semibold mb-2">Ваша конфиденциальность важна для нас</h3>
                <p className="text-muted-foreground">
                  В Alau.ai мы привержены защите вашей конфиденциальности и обеспечению безопасности 
                  вашей личной информации. Настоящая Политика конфиденциальности объясняет, как мы 
                  собираем, используем, раскрываем и защищаем ваши данные при использовании наших 
                  ИИ-сервисов для автоматизации бизнеса в Казахстане.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">1. Информация, которую мы собираем</h3>
                <p className="text-muted-foreground mb-2">
                  Мы собираем информацию, которую вы предоставляете нам напрямую, включая:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Название компании и контактные данные</li>
                  <li>Номера телефонов клиентов и история коммуникаций</li>
                  <li>Данные о встречах и информация о планировании</li>
                  <li>Предпочтения сервиса и шаблоны взаимодействия</li>
                  <li>Данные об использовании, информация об устройстве и аналитика для улучшения наших услуг</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">2. Как мы используем вашу информацию</h3>
                <p className="text-muted-foreground mb-2">
                  Мы используем собранную информацию для:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Предоставления и поддержки наших ИИ-сервисов для автоматизации</li>
                  <li>Обработки и управления коммуникациями с клиентами от вашего имени</li>
                  <li>Планирования встреч и автоматизации бизнес-процессов</li>
                  <li>Анализа и улучшения качества наших услуг</li>
                  <li>Обеспечения соблюдения наших условий обслуживания и правовых обязательств</li>
                  <li>Отправки важных обновлений и уведомлений о сервисе</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">3. Безопасность данных</h3>
                <p className="text-muted-foreground">
                  Мы применяем надежные меры безопасности для защиты ваших данных, включая шифрование, 
                  безопасное хранение данных и регулярные аудиты безопасности. Все данные хранятся в 
                  соответствии с международными стандартами безопасности и законодательством Республики Казахстан.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">4. Обмен данными</h3>
                <p className="text-muted-foreground">
                  Мы не продаем и не передаем вашу личную информацию третьим лицам. Мы можем делиться 
                  данными только с доверенными партнерами, которые помогают нам предоставлять наши услуги, 
                  и только в той мере, в какой это необходимо для выполнения их функций. Все партнеры обязаны 
                  соблюдать конфиденциальность ваших данных.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">5. Ваши права</h3>
                <p className="text-muted-foreground mb-2">
                  В соответствии с законодательством Республики Казахстан, вы имеете право:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Запрашивать доступ к вашим персональным данным</li>
                  <li>Исправлять неточные данные</li>
                  <li>Запрашивать удаление ваших данных</li>
                  <li>Ограничивать обработку ваших данных</li>
                  <li>Возражать против обработки ваших данных</li>
                  <li>Получать копию ваших данных</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">6. Хранение данных</h3>
                <p className="text-muted-foreground">
                  Мы храним ваши данные только в течение времени, необходимого для предоставления наших 
                  услуг или выполнения юридических обязательств. После завершения использования наших 
                  сервисов, ваши данные будут безопасно удалены в соответствии с нашей политикой хранения.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">7. Контактная информация</h3>
                <p className="text-muted-foreground">
                  Если у вас есть вопросы о настоящей Политике конфиденциальности или наших методах 
                  обработки данных, пожалуйста, свяжитесь с нами:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: <a href="mailto:hello@alau.ai" className="text-primary hover:underline">hello@alau.ai</a><br />
                  Телефон: +7 700 000 00 00<br />
                  Telegram: @alauai
                </p>
              </section>

              <section>
                <p className="text-xs text-muted-foreground italic">
                  Последнее обновление: Декабрь 2024
                </p>
              </section>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4 border-t pt-4">
            <Button 
              onClick={handleAgreePrivacy}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-2 flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              Я прочитал и согласен с политикой
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно Условий использования */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground">Условия использования</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[55vh] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="text-lg font-semibold mb-2">Добро пожаловать в Alau.ai</h3>
                <p className="text-muted-foreground">
                  Настоящие Условия использования регулируют ваш доступ и использование платформы 
                  Alau.ai и связанных с ней сервисов автоматизации бизнеса с помощью искусственного 
                  интеллекта. Используя наши услуги, вы соглашаетесь с этими условиями.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">1. Описание услуг</h3>
                <p className="text-muted-foreground">
                  Alau.ai предоставляет платформу ИИ-агентов для автоматизации бизнес-процессов, 
                  включая обработку обращений клиентов через SMS, WhatsApp и Telegram, планирование 
                  встреч, аналитику коммуникаций и интеграцию с бизнес-системами. Наши услуги 
                  предназначены для малого и среднего бизнеса в Республике Казахстан.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">2. Регистрация и аккаунт</h3>
                <p className="text-muted-foreground mb-2">
                  Для использования наших услуг вы должны:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Предоставить точную и актуальную информацию о компании</li>
                  <li>Поддерживать безопасность вашего аккаунта и пароля</li>
                  <li>Немедленно уведомлять нас о любом несанкционированном использовании</li>
                  <li>Нести ответственность за все действия, совершенные через ваш аккаунт</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">3. Использование сервиса</h3>
                <p className="text-muted-foreground mb-2">
                  Вы соглашаетесь использовать наши услуги только:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>В законных коммерческих целях</li>
                  <li>В соответствии с законодательством Республики Казахстан</li>
                  <li>Без нарушения прав третьих лиц</li>
                  <li>Без попыток взлома или нарушения безопасности системы</li>
                  <li>Без отправки спама или нежелательных сообщений</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">4. Тарифы и оплата</h3>
                <p className="text-muted-foreground">
                  Стоимость услуг указана на нашем сайте в выбранном тарифном плане. Оплата 
                  производится ежемесячно или ежегодно в соответствии с выбранным планом. Мы 
                  оставляем за собой право изменять цены с предварительным уведомлением за 30 дней. 
                  Возврат средств возможен в течение 14 дней с момента первой оплаты.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">5. Интеллектуальная собственность</h3>
                <p className="text-muted-foreground">
                  Все материалы, контент, логотипы, товарные знаки и технологии, используемые на 
                  платформе Alau.ai, являются нашей интеллектуальной собственностью или 
                  собственностью наших лицензиаров. Вы получаете ограниченную лицензию на 
                  использование сервиса, но не приобретаете никаких прав на технологии или контент.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">6. Ограничение ответственности</h3>
                <p className="text-muted-foreground">
                  Наши услуги предоставляются "как есть". Мы не гарантируем бесперебойную работу 
                  сервиса и не несем ответственности за косвенные убытки, упущенную выгоду или 
                  потерю данных. Наша максимальная ответственность ограничена суммой, уплаченной 
                  вами за услуги в течение последних 12 месяцев.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">7. Прекращение обслуживания</h3>
                <p className="text-muted-foreground">
                  Мы оставляем за собой право приостановить или прекратить предоставление услуг 
                  при нарушении настоящих Условий использования, неоплате услуг или по другим 
                  законным основаниям. Вы можете отменить подписку в любое время через личный 
                  кабинет.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">8. Изменения условий</h3>
                <p className="text-muted-foreground">
                  Мы можем обновлять настоящие Условия использования время от времени. Существенные 
                  изменения будут сообщены вам по электронной почте или через уведомление на платформе 
                  за 30 дней до вступления в силу. Продолжение использования сервиса после изменений 
                  означает ваше согласие с новыми условиями.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">9. Применимое право</h3>
                <p className="text-muted-foreground">
                  Настоящие Условия регулируются законодательством Республики Казахстан. Все споры 
                  подлежат разрешению в судах Республики Казахстан по месту нахождения компании Alau.ai.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">10. Контактная информация</h3>
                <p className="text-muted-foreground">
                  По вопросам, связанным с настоящими Условиями использования, обращайтесь:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: <a href="mailto:hello@alau.ai" className="text-primary hover:underline">hello@alau.ai</a><br />
                  Телефон: +7 700 000 00 00<br />
                  Telegram: @alauai
                </p>
              </section>

              <section>
                <p className="text-xs text-muted-foreground italic">
                  Последнее обновление: Декабрь 2024
                </p>
              </section>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4 border-t pt-4">
            <Button 
              onClick={handleAgreeTerms}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-2 flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              Я прочитал и согласен с условиями
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Footer;