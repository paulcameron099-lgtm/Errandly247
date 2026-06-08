"use client";

import { MdHexagon } from "react-icons/md";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/homepage.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 z-10 bg-black/60" />

      <motion.div
        className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-7 px-4 text-center text-white md:gap-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <h1 className="font-Euclid text-4xl font-bold md:text-6xl">
          Seamless Errands, Anytime, Anywhere
        </h1>

        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:gap-6">
          <div className="flex flex-row items-center gap-2">
            <MdHexagon className="text-[28px] text-yellow-500" />
            <p className="font-Poppins text-[20px] font-medium">At Home</p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <MdHexagon className="text-[28px] text-yellow-500" />
            <p className="font-Poppins text-[20px] font-medium">On Road</p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <MdHexagon className="text-[28px] text-yellow-500" />
            <p className="font-Poppins text-[20px] font-medium">
              For Your Business
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}