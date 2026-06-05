import About from "@/components/sections/About";
import CaseStudies from "@/components/sections/CaseStudies";
import HeroPart from "@/components/sections/HeroPart";
import Hero from "@/components/sections/Hero";
import OurValues from "@/components/sections/OurValues";
import Partner from "@/components/sections/Partner";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <div>
      <Hero />
      <HeroPart />
      <About />
      <Services />
      <CaseStudies />
      <OurValues />
      <Partner />
    </div>
  );
}
