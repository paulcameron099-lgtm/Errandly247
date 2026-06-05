import AboutHero from "./AboutHero";
import AboutContent from "./AboutContent";
import Choose from "./Choose";
import Commitment from "./Commitment";
import Testimonial from "./Testimonial";
import Partner from "../sections/Partner";

export default function AboutPage() {
  return (
    <>
      <div id="about">
       <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src="/videos/aboutpage.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 z-10 bg-black/40" />

        <div className="relative z-20 h-full">
          <AboutHero />
        </div>
      </div>
        <AboutContent />
        <Choose />
        <Commitment />
        <Testimonial />
        <Partner />
      </div>
    </>
  );
}
