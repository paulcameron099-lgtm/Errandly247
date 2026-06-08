import Image from "next/image";
import cross from "../../../../../public/images/service6.jpeg";
import CustomHero from "@/components/Custom-Errand-Solutions/CustomHero";
import CustomContent from "@/components/Custom-Errand-Solutions/CustomContent";
import CustomService from "@/components/Custom-Errand-Solutions/CustomService";
import Partner from "@/components/sections/Partner";

export default function page() {
  return (
    <>
      <div>
        <section className="relative h-screen w-full overflow-hidden">
 <Image
                       src={cross}
                       alt="Home maintenance"
                       fill
                       priority
                       className="object-cover"
                     />
               
                     <div className="absolute inset-0 bg-black/50" />
               
                     <CustomHero />
                   </section>        
        <CustomContent />
        <CustomService />
        <Partner />
      </div>
    </>
  );
}
