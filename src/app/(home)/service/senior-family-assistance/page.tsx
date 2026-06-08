import Image from "next/image";
import truckyard from "../../../../../public/images/service5.jpeg";
import SeniorHero from "@/components/senior-family-assistance/SeniorHero";
import SeniorContent from "@/components/senior-family-assistance/SeniorContent";
import SeniorService from "@/components/senior-family-assistance/SeniorService";
import Partner from "@/components/sections/Partner";

export default function page() {
  return (
    <>
      <div>
        <section className="relative h-screen w-full overflow-hidden">
                     <Image
                       src={truckyard}
                       alt="Home maintenance"
                       fill
                       priority
                       className="object-cover"
                     />
               
                     <div className="absolute inset-0 bg-black/50" />
               
                     <SeniorHero />
                   </section>
        <SeniorContent />
        <SeniorService />
        <Partner />
      </div>
    </>
  );
}
