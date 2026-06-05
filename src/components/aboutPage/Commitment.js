'use client'
import React from "react";
import { MdHexagon } from "react-icons/md";
import Image from "next/image";
import choose2 from "../../../public/images/about2.jpeg";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Commitment() {
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
                Our commitment
              </h2>
            </div>
            <p className="font-medium font-Poppins text-[#1e1e1e] -mt-5 md:text-[30px] text-[20px]">
              We take pride in building lasting relationships based on trust,
              reliability, and care.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f] md:text-[20px] text-[15px]">
              At Errandly247, our goal isn’t just to complete tasks — it’s to
              improve everyday living with dependable support you can rely on,
              anytime.
            </p>
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-row items-center gap-1">
                <span>🕐</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Reliability — Always on time, always available.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span>💫</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Efficiency — Smart scheduling and professional handling.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span>💡</span>
                <p className="font-normal font-Poppins text-[#1e1e1e]">
                  Innovation — Easy booking, real-time updates, and 24/7 service
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:mt-0 mt-5">
              {/*Our Mission button*/}
              <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
                <Link
                  href="/mission"
                  className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
                >
                  Our Mission
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full md:mt-0 mt-10 lg:order-1 order-2">
            <Image
              src={choose2}
              alt="truck-image"
              className="lg:w-[600px] lg:h-[600px] w-full h-full rounded-lg"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
