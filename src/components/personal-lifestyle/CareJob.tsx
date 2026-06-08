'use client'
import React from "react";
import { motion } from "framer-motion";

export default function CareJob() {
  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 md:mt-20 mt-40 md:py-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <h2 className="font-Euclid font-bold text-[#1e1e1e] md:text-[80px] text-[30px]">
          Caregiver / Senior & Family Assistant
        </h2>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-[500px] object-cover -z-1 rounded-2xl my-10"
        >
          <source src="/videos/senior.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </>
  );
}
