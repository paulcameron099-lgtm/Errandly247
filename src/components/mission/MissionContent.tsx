'use client'
import React from 'react'
import mission from "../../../public/images/mission1.png";
import Image from "next/image";
import { MdHexagon } from "react-icons/md";
import { motion } from 'framer-motion';

export default function MissionContent() {
  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 md:py-40"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex flex-row items-center justify-start gap-1 xl:-mb-3 mb-2">
          <MdHexagon />
          <h2 className="font-bold font-Euclid text-[#1e1e1e]">Our mission</h2>
        </div>
        <div className="flex lg:flex-row flex-col items-center gap-20 justify-center">
          <div className="lg:w-1/2 w-full flex flex-col items-start gap-5">
            <h2 className="font-medium font-Poppins md:text-[30px] text-[18px] text-[#1e1e1e] xl:w-[80%] w-full">
              Helping you live smarter, faster, and more stress-free every day.
            </h2>
            <p className="font-medium font-Poppins md:text-[18px] text-[15px] text-[#6f6f6f]">
              At Errandly247, our mission is to redefine convenience by
              delivering reliable, on-demand errands and personal services that
              save time, simplify life, and provide peace of mind — 24/7.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <Image
              src={mission}
              alt="about-image"
              className="w-[600px] rounded-lg h-[400px]"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
