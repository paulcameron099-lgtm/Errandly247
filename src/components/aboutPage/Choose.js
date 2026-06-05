'use client'
import React from "react";
import choose from "../../../public/images/about1.jpeg";
import Image from "next/image";
import { MdHexagon } from "react-icons/md";
import { motion } from "framer-motion";

export default function Choose() {
  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 md:py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex flex-row items-center justify-start gap-1 xl:-mb-3 mb-2">
          <MdHexagon />
          <h2 className="font-bold font-Euclid text-[#1e1e1e]">
            Why Choose Errandly247
          </h2>
        </div>
        <div className="flex lg:flex-row flex-col items-center gap-20 justify-center">
          <div className="lg:w-1/2 w-full flex flex-col items-start gap-5">
            <h2 className="font-medium font-Poppins md:text-[40px] text-[18px] text-[#1e1e1e] xl:w-[80%] w-full">
              Delivering efficiency, trust, and peace of mind in every errand.
            </h2>
            <p className="font-medium font-Poppins md:text-[18px] text-[15px] text-[#6f6f6f]">
              At Errandly247, we understand that time is your most valuable
              asset. Our mission is to simplify your day through reliable,
              affordable, and flexible services designed for individuals,
              families, and businesses alike.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <Image
              src={choose}
              alt="about-image"
              className="w-[600px] rounded-2xl"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
