import { useState } from "react";
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
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="min-h-screen">
      <LoadingScreen isReady={videoLoaded} minDisplayTime={400} />
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