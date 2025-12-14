import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard, Settings, MessageSquare, Phone, Calendar, TrendingUp, ArrowUp, ArrowDown, BarChart3, MessageCircle, Clock, ArrowRight, FileText, Menu } from "lucide-react";

// Иконки для Telegram и WhatsApp
const TelegramIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>;
const WhatsAppIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>;

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    profile,
    signOut,
    isAuthenticated,
    isLoading,
    refreshProfile
  } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [activeNav, setActiveNav] = useState("overview");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0
  });
  const [tooltipValue, setTooltipValue] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    } else if (isAuthenticated) {
      refreshProfile();
    }
  }, [isAuthenticated, isLoading, navigate, refreshProfile]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Получаем имя пользователя из профиля
  const userName = profile?.name || user?.email?.split('@')[0] || "Пользователь";

  // Данные для графика
  const chartData = [{
    day: "Пн",
    value: 12
  }, {
    day: "Вт",
    value: 8
  }, {
    day: "Ср",
    value: 15
  }, {
    day: "Чт",
    value: 10
  }, {
    day: "Пт",
    value: 18
  }, {
    day: "Сб",
    value: 6
  }, {
    day: "Вс",
    value: 4
  }];
  const maxValue = Math.max(...chartData.map(d => d.value));

  // Статистика
  const stats = [{
    title: "Начато разговоров",
    value: "7",
    change: "-46%",
    changeType: "negative",
    description: "от предыдущего периода",
    icon: Phone,
    iconColor: "text-[#51C2FB]"
  }, {
    title: "Завершено разговоров",
    value: "3",
    change: "-25%",
    changeType: "negative",
    description: "от предыдущего периода",
    icon: MessageSquare,
    iconColor: "text-[#51C2FB]"
  }, {
    title: "Забронировано встреч",
    value: "1",
    change: "+100%",
    changeType: "positive",
    description: "от предыдущего периода",
    icon: Calendar,
    iconColor: "text-[#51C2FB]"
  }, {
    title: "Конверсия",
    value: "14%",
    change: "+100%",
    changeType: "positive",
    description: "от предыдущего периода",
    icon: TrendingUp,
    iconColor: "text-[#51C2FB]"
  }];

  // Навигационные элементы
  const navItems = [{
    id: "overview",
    label: "Обзор",
    icon: BarChart3
  }, {
    id: "conversations",
    label: "Разговоры",
    icon: MessageCircle
  }, {
    id: "follow-up",
    label: "Последующие",
    icon: Clock
  }, {
    id: "telegram",
    label: "Telegram",
    icon: TelegramIcon
  }, {
    id: "whatsapp",
    label: "WhatsApp",
    icon: WhatsAppIcon
  }, {
    id: "prompt-settings",
    label: "Настройки промпта",
    icon: FileText
  }, {
    id: "ai-settings",
    label: "Настройки AI",
    icon: Settings
  }];

  // Компонент навигации (переиспользуется для desktop и mobile)
  const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
        Навигация
      </h2>
      <div className="space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveNav(item.id);
                onItemClick?.();
              }} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer select-none ${
                isActive 
                  ? "bg-[#51C2FB]/10 text-[#51C2FB] border-l-4 border-[#51C2FB]" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );

  const periods = [
    { key: "today", label: "Сегодня" },
    { key: "7days", label: "7 дней" },
    { key: "30days", label: "30 дней" },
    { key: "60days", label: "60 дней" },
    { key: "90days", label: "90 дней" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Мобильный хедер */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-50 border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between">
        <h1 
          className="text-xl font-bold text-slate-900 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Alau<span className="text-[#51C2FB]">.ai</span>
        </h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-6 border-b border-slate-200">
              <h1 
                className="text-2xl font-bold text-slate-900 cursor-pointer" 
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                Alau<span className="text-[#51C2FB]">.ai</span>
              </h1>
            </div>
            <nav className="flex-1 p-4">
              <NavContent onItemClick={() => setMobileMenuOpen(false)} />
            </nav>
            <div className="p-4 border-t border-slate-200">
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }} 
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer select-none"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Выйти</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Левая боковая панель навигации - только desktop */}
      <aside className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Логотип */}
        <div className="p-6 border-b border-slate-200">
          <h1 
            className="text-2xl font-bold text-slate-900 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate("/")}
          >
            Alau<span className="text-[#51C2FB]">.ai</span>
          </h1>
        </div>

        {/* Навигация */}
        <nav className="flex-1 p-4">
          <NavContent />
        </nav>

        {/* Выход */}
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer select-none"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <div className="flex-1 pt-16 md:pt-0 relative z-0">
        <main className="flex-1 md:ml-64">
          <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Заголовок */}
              <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                    Панель управления
                  </h1>
                  <p className="text-slate-600 text-sm md:text-base">
                    Добро пожаловать, {userName}
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById("pricing");
                      element?.scrollIntoView({
                        behavior: "smooth"
                      });
                    }, 100);
                  }} 
                  style={{
                    background: "linear-gradient(90deg, rgba(113, 181, 234, 1) 0%, rgba(81, 194, 251, 1) 80%)"
                  }} 
                  className="hover:opacity-90 text-white font-medium shadow-md w-full sm:w-auto"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Обновить план
                </Button>
              </div>

              {/* Статистика в реальном времени */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    Статистика в реальном времени
                  </h2>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {periods.map(period => (
                      <Button 
                        key={period.key} 
                        variant={selectedPeriod === period.key ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedPeriod(period.key)} 
                        className={`whitespace-nowrap flex-shrink-0 ${
                          selectedPeriod === period.key 
                            ? "text-white hover:opacity-90" 
                            : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                        }`} 
                        style={selectedPeriod === period.key ? {
                          background: "linear-gradient(90deg, rgba(113, 181, 234, 1) 0%, rgba(81, 194, 251, 1) 80%)",
                          borderColor: "rgba(0, 0, 0, 0)",
                          borderStyle: "none",
                          borderImage: "none"
                        } : undefined}
                      >
                        {period.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index} className="p-4 md:p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-xs md:text-sm text-slate-600 mb-2">{stat.title}</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {stat.changeType === "positive" 
                                ? <ArrowUp className="w-3 h-3 text-green-600" /> 
                                : <ArrowDown className="w-3 h-3 text-red-600" />
                              }
                              <span className={`text-xs md:text-sm font-medium ${
                                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                              }`}>
                                {stat.change}
                              </span>
                              <span className="text-xs text-slate-500 hidden sm:inline">{stat.description}</span>
                            </div>
                          </div>
                          <div className={`p-2 rounded-lg bg-[#51C2FB]/10 ${stat.iconColor} opacity-60`}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* График разговоров */}
              <Card className="p-4 md:p-6 bg-white border border-slate-200 shadow-sm">
                <div className="mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                    Еженедельные начатые разговоры
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600">Разговоры за прошедшую неделю</p>
                </div>
                <div 
                  className="h-[250px] md:h-[300px] relative" 
                  onMouseMove={e => {
                    if (hoveredBar !== null) {
                      setTooltipPosition({
                        x: e.clientX,
                        y: e.clientY
                      });
                    }
                  }} 
                  onMouseLeave={() => {
                    setHoveredBar(null);
                    setTooltipValue(null);
                  }}
                >
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between pr-2">
                    {[24, 18, 12, 6, 0].map(val => (
                      <span key={val} className="text-xs text-slate-500 text-right w-6 md:w-8">
                        {val}
                      </span>
                    ))}
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-8 md:ml-12 mr-2 md:mr-4 h-[calc(100%-3rem)] relative pb-8">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 6, 12, 18, 24].map(val => (
                        <div key={val} className="w-full border-t border-dashed border-slate-200" />
                      ))}
                    </div>
                    
                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-between gap-1 md:gap-2 px-1 md:px-2">
                      {chartData.map((item, index) => {
                        const height = item.value / maxValue * 100;
                        const isHovered = hoveredBar === index;
                        return (
                          <div 
                            key={index} 
                            className="flex-1 flex flex-col items-center justify-end group relative" 
                            style={{ height: "100%" }} 
                            onMouseEnter={e => {
                              setHoveredBar(index);
                              setTooltipValue(item.value);
                              setTooltipPosition({
                                x: e.clientX,
                                y: e.clientY
                              });
                            }} 
                            onMouseMove={e => {
                              setTooltipPosition({
                                x: e.clientX,
                                y: e.clientY
                              });
                              if (hoveredBar !== index) {
                                setHoveredBar(index);
                                setTooltipValue(item.value);
                              }
                            }}
                          >
                            {isHovered && <div className="absolute inset-0 bg-slate-100/50 rounded" />}
                            <div 
                              className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative z-10" 
                              style={{
                                height: `${height}%`,
                                backgroundColor: "rgba(81, 194, 251, 1)",
                                minHeight: height > 0 ? "4px" : "0"
                              }} 
                            />
                            <span className="text-xs text-slate-600 mt-2 font-medium absolute -bottom-6 z-10">
                              {item.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Tooltip */}
                {hoveredBar !== null && tooltipValue !== null && (
                  <div 
                    className="fixed bg-slate-900 text-white px-3 py-1.5 rounded text-sm font-medium pointer-events-none z-50" 
                    style={{
                      left: tooltipPosition.x + 10,
                      top: tooltipPosition.y - 30
                    }}
                  >
                    {tooltipValue} разговоров
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;