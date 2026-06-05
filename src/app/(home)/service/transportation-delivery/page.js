import Image from "next/image";
import workers from "../../../../../public/images/service2.jpeg";
import TransportDeliveryHero from "@/components/transport-delivery/TransportDeliveryHero";
import TransportDeliverycontent from "@/components/transport-delivery/TransportDeliverycontent";
import TransportDeliveryServices from "@/components/transport-delivery/TransportDeliveryServices";
import Partner from "@/components/sections/Partner";

export default function page() {
  return (
    <>
      <div>
        <section className="relative h-screen w-full overflow-hidden">
                     <Image
                       src={workers}
                       alt="Home maintenance"
                       fill
                       priority
                       className="object-cover"
                     />
               
                     <div className="absolute inset-0 bg-black/50" />
               
                     <TransportDeliveryHero />
                   </section>
        <TransportDeliverycontent />
        <TransportDeliveryServices />
        <Partner />
      </div>
    </>
  );
}
