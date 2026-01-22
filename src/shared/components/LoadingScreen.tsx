import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
  minDisplayTime?: number;
}

const LoadingScreen = ({ onLoadComplete, minDisplayTime = 2000 }: LoadingScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onLoadComplete, 500); // Wait for exit animation
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [onLoadComplete, minDisplayTime]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Mountain SVG */}
        <div className="relative w-24 h-24">
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Back mountain - draws second */}
            <path
              d="M25 70 L50 25 L75 70"
              className="stroke-primary/40"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 150,
                strokeDashoffset: 150,
                animation: "drawMountain 1s ease-out 0.3s forwards",
              }}
            />
            
            {/* Front mountain - draws first */}
            <path
              d="M10 70 L40 20 L55 45 L70 30 L90 70"
              className="stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: 200,
                animation: "drawMountain 1.2s ease-out forwards",
              }}
            />
            
            {/* Snow cap accent */}
            <path
              d="M35 28 L40 20 L45 28"
              className="stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 30,
                animation: "drawMountain 0.5s ease-out 1s forwards",
              }}
            />
          </svg>
          
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "1.5s" }} />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex items-center gap-1 opacity-0 animate-[fade-in_0.5s_ease-out_0.8s_forwards]">
          <span className="text-2xl font-bold text-foreground">Alau</span>
          <span className="text-2xl font-bold text-primary">.ai</span>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: "pulse 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes drawMountain {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
