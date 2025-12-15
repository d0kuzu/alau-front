import Header from "@/shared/components/Header";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Channels from "../sections/Channels";
import ForWho from "../sections/ForWho";
import About from "../sections/About";
import Pricing from "../sections/Pricing";
import Contact from "../sections/Contact";
import Footer from "@/shared/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
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
