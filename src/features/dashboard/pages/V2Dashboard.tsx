import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Crown,
  FileText,
  LogOut,
  MessageCircle,
  Phone,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/contexts/AuthContext";
import V2ConversationsPage from "../components/V2ConversationsPage";
import V2PromptSettings from "../components/V2PromptSettings";

const periods = ["Today", "7 days", "30 days", "60 days", "90 days"];
const chartDays = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

const stats = [
  {
    title: "Conversations Started",
    value: "0",
    change: "0%",
    note: "new conversations today",
    icon: Phone,
  },
  {
    title: "Conversations Completed",
    value: "0",
    change: "0%",
    note: "customers who responded",
    icon: MessageCircle,
  },
  {
    title: "Booked Appointments",
    value: "1",
    change: "-67%",
    note: "appointments booked today",
    icon: CalendarDays,
  },
  {
    title: "Conversion Rate",
    value: "0%",
    change: "0%",
    note: "appointments to conversations ratio",
    icon: TrendingUp,
  },
];

const navItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "conversations", label: "Conversations", icon: MessageCircle },
  { id: "prompt-settings", label: "AI Prompt Settings", icon: FileText },
];

const getLoginPath = (pathname: string) =>
  pathname.startsWith("/frontend") ? "/frontend/login" : "/login";

const V2Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    profile,
    signOut,
    isAuthenticated,
    isLoading,
    refreshProfile,
  } = useAuth();
  const [activeNav, setActiveNav] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(getLoginPath(location.pathname));
      return;
    }

    if (isAuthenticated) {
      refreshProfile();
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, refreshProfile]);

  useEffect(() => {
    if (sessionStorage.getItem("zerde_v2_login_popup") === "1") {
      sessionStorage.removeItem("zerde_v2_login_popup");
      setShowWelcomePopup(true);

      const timeout = window.setTimeout(() => setShowWelcomePopup(false), 7000);
      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate(getLoginPath(location.pathname));
  };

  const userName = profile?.name || user?.email?.split("@")[0] || "kawka";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#ff8f6a]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white text-[#020817]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[320px] flex-col border-r border-[#e6ebf2] bg-[#fbfbfc] md:flex">
        <div className="px-7 pb-12 pt-9">
          <h1 className="text-[2rem] font-bold leading-none tracking-normal text-[#071225]">
            Zerde<span className="text-[#ff6f2d]">.ai</span>
          </h1>
        </div>

        <nav className="flex-1 px-4">
          <p className="mb-3 px-1 text-base font-medium text-[#5f6c7f]">Navigation</p>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`flex h-10 w-full items-center gap-3 rounded-[7px] px-3 text-left text-[1.05rem] transition-colors ${
                    isActive
                      ? "bg-[#f1f1f3] font-semibold text-[#071225]"
                      : "font-medium text-[#2f3643] hover:bg-[#f4f5f7]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="px-7 pb-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 text-[1.05rem] font-medium text-[#2f3643] transition-colors hover:text-[#ff6f2d]"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-[320px]">
        <div className="mx-auto max-w-[1660px] px-5 py-8 md:px-10 md:py-12">
          {activeNav === "conversations" ? (
            <V2ConversationsPage />
          ) : activeNav === "prompt-settings" ? (
            <V2PromptSettings />
          ) : (
            <>
          <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-[2.25rem] font-bold leading-tight text-[#010817]">Dashboard</h2>
              <p className="mt-2 text-[1.45rem] font-medium text-[#6f7e95]">Welcome back, {userName}</p>
            </div>
            <Button
              type="button"
              className="h-[52px] rounded-[8px] bg-[#ff8f6a] px-5 text-lg font-semibold text-white shadow-none hover:bg-[#ff7d53]"
            >
              <Crown className="mr-3 h-5 w-5" strokeWidth={1.9} />
              Upgrade Plan
            </Button>
          </div>

          <section>
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <h3 className="text-[1.45rem] font-bold text-[#010817]">Live Statistics</h3>
              <div className="inline-flex w-fit rounded-[8px] bg-[#f1f5f9] p-1">
                {periods.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    className={`h-10 rounded-[6px] px-5 text-base font-semibold transition-colors ${
                      selectedPeriod === period
                        ? "bg-white text-[#020817] shadow-sm"
                        : "text-[#66748a] hover:text-[#020817]"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.title}
                    className="min-h-[188px] rounded-[8px] border border-[#dfe6ef] bg-white px-8 py-8 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="mb-4 text-[1.05rem] font-semibold text-[#64748b]">{stat.title}</p>
                        <p className="text-[2rem] font-bold leading-none text-[#010817]">{stat.value}</p>
                        <p className="mt-3 text-base text-[#68788f]">
                          <span className="mr-2 font-semibold text-[#16a34a]">{stat.change}</span>
                          from previous period
                        </p>
                        <p className="mt-1 text-base text-[#68788f]">{stat.note}</p>
                      </div>
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-[#ff8f6a]" strokeWidth={1.8} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-5 max-w-[1085px] rounded-[8px] border border-[#dfe6ef] bg-white px-8 py-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="mb-9">
              <h3 className="text-[1.9rem] font-bold leading-tight text-[#010817]">Weekly Conversations Started</h3>
              <p className="mt-1 text-lg font-medium text-[#68788f]">Conversations for the past week</p>
            </div>

            <div className="grid h-[390px] grid-cols-[44px_1fr] grid-rows-[1fr_32px]">
              <div className="row-span-1 flex flex-col justify-between pr-3 text-right text-base text-[#79828d]">
                {[4, 3, 2, 1, 0].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              <div className="relative border border-dashed border-[#e7ebf1]">
                <div className="absolute inset-0 grid grid-rows-4">
                  {[0, 1, 2, 3].map((line) => (
                    <span key={line} className="border-b border-dashed border-[#e7ebf1]" />
                  ))}
                </div>
                <div className="absolute inset-0 grid grid-cols-7">
                  {chartDays.map((day) => (
                    <span key={day} className="border-r border-dashed border-[#edf0f5] last:border-r-0" />
                  ))}
                </div>
              </div>
              <div />
              <div className="grid grid-cols-7 pt-2 text-center text-base font-medium text-[#79828d]">
                {chartDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </section>

            </>
          )}
        </div>
      </div>

      {showWelcomePopup && (
        <div className="fixed bottom-6 right-5 z-50 w-[min(490px,calc(100vw-2.5rem))] rounded-[8px] border border-[#dfe6ef] bg-white px-8 py-7 shadow-[0_20px_42px_rgba(15,23,42,0.18)]">
          <p className="text-[1.15rem] font-bold text-[#171c28]">Welcome back!</p>
          <p className="mt-2 text-[1.05rem] font-medium text-[#2f3643]">
            You have been signed in successfully.
          </p>
        </div>
      )}
    </main>
  );
};

export default V2Dashboard;
