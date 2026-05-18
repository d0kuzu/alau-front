import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import Header from "@/shared/components/Header";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        let message = t.auth.toasts.loginErrorDefault;
        if (error.message.includes("Invalid login credentials")) {
          message = t.auth.toasts.invalidCredentials;
        } else if (error.message.includes("Email not confirmed")) {
          message = t.auth.toasts.emailNotConfirmed;
        }
        
        toast({
          title: t.auth.toasts.loginErrorTitle,
          description: message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: t.auth.toasts.successTitle,
        description: t.auth.toasts.loginSuccess,
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t.auth.toasts.loginErrorTitle,
        description: error instanceof Error ? error.message : t.auth.toasts.loginErrorDefault,
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
        title: t.auth.toasts.errorTitle,
        description: t.auth.toasts.passwordsMismatch,
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: t.auth.toasts.errorTitle,
        description: t.auth.toasts.passwordTooShort,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        registerData.email,
        registerData.password
      );

      if (error) {
        let message = t.auth.toasts.registerErrorDefault;
        if (error.message.includes("User already registered")) {
          message = t.auth.toasts.alreadyRegistered;
        }
        
        toast({
          title: t.auth.toasts.registerErrorTitle,
          description: message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.auth.toasts.successTitle,
        description: t.auth.toasts.registerSuccess,
      });

      // Очистка формы
      setRegisterData({ 
        email: "", 
        password: "", 
        confirmPassword: "" 
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t.auth.toasts.registerErrorTitle,
        description: error instanceof Error ? error.message : t.auth.toasts.registerErrorDefault,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {/* Левая панель - Форма входа */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 md:py-12 bg-white">
          <div className="w-full max-w-md space-y-4 md:space-y-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground mb-2 md:mb-4"
            >
              {t.auth.backHome}
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t.auth.welcome}</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {t.auth.accountPrompt}
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t.auth.loginTab}</TabsTrigger>
                <TabsTrigger value="register">{t.auth.registerTab}</TabsTrigger>
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
                    <Label htmlFor="login-password">{t.auth.password}</Label>
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
                    {isLoading ? t.auth.loginLoading : t.auth.loginButton}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <Label htmlFor="register-password">{t.auth.password}</Label>
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
                    <Label htmlFor="register-confirm">{t.auth.confirmPassword}</Label>
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
                    {isLoading ? t.auth.registerLoading : t.auth.registerButton}
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
            backgroundColor: 'rgba(169, 225, 253, 1)'
          }}
        >
          <div className="max-w-lg space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {t.auth.marketingTitle}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t.auth.marketingSubtitle}
              </p>
            </div>

            <ul className="space-y-4">
              {t.auth.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground">{bullet}</span>
                </li>
              ))}
            </ul>

            <div 
              className="p-6 rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(81, 194, 251, 0.1)',
                border: '1px solid rgba(81, 194, 251, 0.2)'
              }}
            >
              <p className="text-foreground italic mb-3">
                "{t.auth.quote}"
              </p>
              <p className="text-sm text-muted-foreground">
                {t.auth.quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
