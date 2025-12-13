import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Channels from "@/components/Channels";
import ForWho from "@/components/ForWho";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AnimatedSection>
        <Features />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Channels />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <ForWho />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <About />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Pricing />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Contact />
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
