import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { login, register } from "@/lib/api";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(loginData);
      
      if (result.user) {
        setAuthUser(result.user);
      }
      
      toast({
        title: "Успешно!",
        description: result.message || "Вход выполнен успешно",
      });

      // Перенаправление на личный кабинет через небольшую задержку
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Произошла ошибка при входе",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация паролей
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      if (result.user) {
        setAuthUser(result.user);
      }

      toast({
        title: "Успешно!",
        description: result.message || "Регистрация прошла успешно",
      });

      // Очистка формы и переключение на вкладку входа
      setRegisterData({ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "" 
      });

      // Перенаправление на личный кабинет через небольшую задержку
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {/* Левая панель - Форма входа */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-white">
          <div className="w-full max-w-md space-y-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground mb-4"
            >
              ← Вернуться на главную
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Добро пожаловать</h1>
              <p className="text-muted-foreground">
                Войдите в свой аккаунт Alau.ai
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Вход..." : "Войти"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Имя</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Ваше имя"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Правая панель - Маркетинговый контент */}
        <div 
          className="hidden lg:flex lg:w-1/2 items-center justify-center px-12 py-20 text-white"
          style={{
            backgroundColor: 'rgba(158, 223, 255, 1)'
          }}
        >
          <div className="max-w-lg space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Добро пожаловать в Alau.ai
              </h2>
              <p className="text-xl text-muted-foreground">
                Преобразуйте общение с клиентами с помощью автоматизации на базе ИИ
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-foreground">Автоматизация поддержки клиентов на нескольких каналах</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-foreground">Интеллектуальный анализ разговоров на базе ИИ</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-foreground">Беспроблемная интеграция с вашими существующими инструментами</span>
              </li>
            </ul>

            <div 
              className="p-6 rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(81, 194, 251, 0.1)',
                border: '1px solid rgba(81, 194, 251, 0.2)'
              }}
            >
              <p className="text-foreground italic mb-3">
                "Alau.ai революционизировал то, как мы обрабатываем поддержку клиентов. Время отклика улучшилось на 80%, а показатели удовлетворенности клиентов достигли рекордного уровня."
              </p>
              <p className="text-sm text-muted-foreground">
                — Сара Чен, Менеджер по работе с клиентами
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

