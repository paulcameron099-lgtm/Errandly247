import Image from "next/image";
import truck from '../../../../../public/images/service1.jpeg'
import HomeMainHero from "@/components/home-maintenance/HomeMainHero";
import HomeMaincnt from "@/components/home-maintenance/HomeMaincnt";
import HomeMainService from "@/components/home-maintenance/HomeMainService";
import Partner from "@/components/sections/Partner";

export default function page() {
  return (
    <>
      <div>
       <section className="relative h-screen w-full overflow-hidden">
      <Image
        src={truck}
        alt="Home maintenance"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <HomeMainHero />
    </section>
        <HomeMaincnt />
        <HomeMainService />
        <Partner />
      </div>
    </>
  );
}
