'use client'
import React from 'react'
import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <>
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center gap-7 px-4 text-center text-white md:gap-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <h1 className="text-4xl md:text-6xl font-bold font-Euclid">
          Convenience You Can Count On.
        </h1>
        <p className="font-medium font-Poppins text-white text-2xl lg:w-1/2 w-full">
          Trusted by individuals and businesses for seamless, reliable, and
          on-demand errand services — anytime, anywhere. We make life easier,
          24/7.
        </p>
      </motion.div>
    </>
  );
}
