'use client'
import React from 'react'
import { motion } from 'framer-motion';

export default function PersonalHero() {
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
          Personal & Lifestyle Services
        </h1>
      </motion.div>
    </>
  );
}
