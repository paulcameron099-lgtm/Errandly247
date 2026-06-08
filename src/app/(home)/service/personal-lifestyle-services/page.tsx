import Image from "next/image";
import truckroad from "../../../../../public/images/service3.jpeg";
import PersonalHero from "@/components/personal-lifestyle/PersonalHero";
import PersonalContent from "@/components/personal-lifestyle/PersonalContent";
import PersonalService from "@/components/personal-lifestyle/PersonalService";
import Partner from "@/components/sections/Partner";

export default function page() {
  return (
    <>
      <div>
        <section className="relative h-screen w-full overflow-hidden">
                     <Image
                       src={truckroad}
                       alt="Home maintenance"
                       fill
                       priority
                       className="object-cover"
                     />
               
                     <div className="absolute inset-0 bg-black/50" />
               
                     <PersonalHero />
                   </section>
        <PersonalContent />
        <PersonalService />
        <Partner />
      </div>
    </>
  );
}
