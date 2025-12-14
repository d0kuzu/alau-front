import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Channels from "@/components/Channels";
import ForWho from "@/components/ForWho";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
