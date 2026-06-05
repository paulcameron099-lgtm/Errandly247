import ServiceHero from "./ServiceHero";
import ServiceContent from "./ServiceContent";
import Partner from "../sections/Partner";


export default function ServicePage() {
  return (
    <>
      <div id="service">
        <div className="relative h-screen w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          >
            <source src="/videos/servicepage.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 z-10 bg-black/40" />

          <div className="relative z-20 h-full">
            <ServiceHero />
          </div>
        </div>
        <ServiceContent />
        <Partner />
      </div>
    </>
  );
}
