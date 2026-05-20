import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { useAuth } from "@/shared/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const v2DashboardPath = location.pathname.startsWith("/frontend")
    ? "/frontend/v2/dashboard"
    : "/v2/dashboard";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(v2DashboardPath);
    }
  }, [isAuthenticated, authLoading, navigate, v2DashboardPath]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);

      if (error) {
        let message = "An error occurred during sign-in";

        if (error.message.includes("Invalid login credentials")) {
          message = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          message = "Email has not been confirmed";
        }

        toast({
          title: "Sign-in error",
          description: message,
          variant: "destructive",
        });
        return;
      }

      sessionStorage.setItem("zerde_v2_login_popup", "1");
      navigate(v2DashboardPath);
    } catch (error) {
      toast({
        title: "Sign-in error",
        description: error instanceof Error ? error.message : "An error occurred during sign-in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#ff8f6a]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#071225]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[35.25rem] rounded-[8px] border border-[#e5ebf1] bg-white px-6 py-9 shadow-[0_20px_36px_-28px_rgba(7,18,37,0.45)] sm:px-8 md:px-[1.875rem] md:py-10">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold leading-tight text-[#010817] md:text-[2rem]">
                Welcome back
              </h1>
              <p className="text-base text-[#718199]">
                Sign in to your{" "}
                <span className="font-semibold text-[#071225]">
                  Zerde.<span className="text-[#ff8f6a]">ai</span>
                </span>{" "}
                account
              </p>
            </div>

            <div className="mt-10 space-y-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="login-email" className="text-base font-semibold text-[#071225]">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                    required
                    className="h-[3.75rem] rounded-[999px] border-[#e2e8f0] px-4 text-base text-[#071225] placeholder:text-[#718199] focus-visible:ring-[#ff8f6a]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="login-password" className="text-base font-semibold text-[#071225]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                      required
                      className="h-[3.75rem] rounded-[999px] border-[#e2e8f0] px-4 pr-12 text-base text-[#071225] placeholder:text-[#718199] focus-visible:ring-[#ff8f6a]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-[#718199] hover:bg-transparent hover:text-[#071225]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-[3.875rem] w-full rounded-[24px] bg-[#ff8f6a] text-base font-semibold text-white shadow-none transition-colors hover:bg-[#ff7d53]"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <p className="text-center text-base text-[#718199]">
                Need an account? Contact your administrator
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-[32rem] items-center justify-center bg-[linear-gradient(135deg,#ff936a_0%,#eba0ab_45%,#c9b6ff_100%)] px-8 py-14 text-white lg:min-h-screen lg:px-14">
          <div className="w-full max-w-[36rem] space-y-10 text-center">
            <div className="space-y-7">
              <h2 className="text-4xl font-bold leading-tight md:text-[2.5rem]">
                Welcome to Zerde.ai
              </h2>
              <p className="mx-auto max-w-[34rem] text-2xl font-medium leading-relaxed">
                Transform your customer conversations with AI-powered automation
              </p>
            </div>

            <ul className="mx-auto inline-flex max-w-[35rem] flex-col gap-6 text-left text-[1.35rem] font-medium leading-snug">
              <li className="flex items-start gap-4">
                <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-white" />
                <span>Multi-channel customer support automation</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-white" />
                <span>AI-powered conversation intelligence</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-white" />
                <span>Seamless integration with your existing tools</span>
              </li>
            </ul>

            <div className="mx-auto max-w-[35.25rem] rounded-[24px] border border-white/20 bg-white/10 px-7 py-8 backdrop-blur-sm">
              <p className="text-lg font-semibold leading-relaxed text-white/90">
                "Zerde.ai has revolutionized how we handle customer support. Our response time improved
                by 80% and customer satisfaction scores are at an all-time high."
              </p>
              <p className="mt-5 text-base font-bold text-white/95">
                - Sarah Chen, Customer Success Manager
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
