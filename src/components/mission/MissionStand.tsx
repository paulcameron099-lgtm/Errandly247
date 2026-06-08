'use client'
import React from 'react'
import { MdHexagon } from "react-icons/md";
import Image from "next/image";
import miss from "../../../public/images/mission2.jpeg";
import { motion } from 'framer-motion';

export default function MissionStand() {
  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex lg:flex-row flex-col xl:gap-20 lg:gap-10 md:gap-10 gap-20 items-center justify-center">
          <div className="lg:w-1/2 w-full flex flex-col items-start gap-10 lg:order-2 order-1">
            <div className="flex flex-row items-center justify-start gap-1">
              <MdHexagon />
              <h2 className="font-bold font-Euclid text-[#1e1e1e]">
                What we stand for
              </h2>
            </div>
            <p className="font-medium font-Poppins text-[#1e1e1e] -mt-5 md:text-[30px] text-[20px]">
              Our core values guide everything we do:
            </p>
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-row items-center gap-1">
                <span>📦</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Reliability — Completing every task on time, every time.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span>🚚</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Efficiency — Streamlining errands so your day runs smoothly.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span>⌛</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Innovation — Using smart tools and scheduling to keep services
                  seamless and transparent.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span>🤝</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Care — Providing trusted, friendly service with every errand.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full md:mt-0 mt-10 lg:order-1 order-2">
            <Image
              src={miss}
              alt="truck-image"
              className="lg:w-[600px] lg:h-[350px] w-full h-full rounded-lg"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
