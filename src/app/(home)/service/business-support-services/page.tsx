import Image from "next/image";
import last from "../../../../../public/images/service4.jpeg";
import BusinessHero from "@/components/bussiness-support/BusinessHero";
import BusinessContent from "@/components/bussiness-support/BusinessContent";
import BusinessService from "@/components/bussiness-support/BusinessService";
import Partner from "@/components/sections/Partner";

export default function page() {
  return (
    <>
      <div>
        <section className="relative h-screen w-full overflow-hidden">
              <Image
                src={last}
                alt="Home maintenance"
                fill
                priority
                className="object-cover"
              />
        
              <div className="absolute inset-0 bg-black/50" />
        
              <BusinessHero />
        </section>
        <BusinessContent />
        <BusinessService />
        <Partner />
      </div>
    </>
  );
}
