import { useState, useEffect, useCallback } from "react";
import Header from "@/shared/components/Header";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Channels from "../sections/Channels";
import ForWho from "../sections/ForWho";
import About from "../sections/About";
import Pricing from "../sections/Pricing";
import Contact from "../sections/Contact";
import Footer from "@/shared/components/Footer";
import LoadingScreen from "@/shared/components/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Listen for video load event from Hero component
  useEffect(() => {
    const handleVideoLoaded = () => setVideoLoaded(true);
    window.addEventListener("heroVideoLoaded", handleVideoLoaded);
    return () => window.removeEventListener("heroVideoLoaded", handleVideoLoaded);
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading && (
        <LoadingScreen 
          onLoadComplete={handleLoadComplete} 
          minDisplayTime={videoLoaded ? 1500 : 2500}
        />
      )}
      <Header />
      <Hero onVideoLoad={() => window.dispatchEvent(new Event("heroVideoLoaded"))} />
      <Features />
      <Channels />
      <ForWho />
      <About />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
