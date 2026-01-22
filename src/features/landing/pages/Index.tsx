import { useState, useEffect } from "react";
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

const CACHE_KEY = "alau_video_loaded";

const Index = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [skipLoading] = useState(() => sessionStorage.getItem(CACHE_KEY) === "true");

  useEffect(() => {
    if (videoLoaded) {
      sessionStorage.setItem(CACHE_KEY, "true");
    }
  }, [videoLoaded]);

  return (
    <div className="min-h-screen">
      {!skipLoading && <LoadingScreen isReady={videoLoaded} minDisplayTime={200} />}
      <Header />
      <Hero onVideoLoad={() => setVideoLoaded(true)} />
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