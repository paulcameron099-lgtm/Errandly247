'use client'
import React from 'react'
import { MdHexagon } from "react-icons/md";
import Image from 'next/image';
import CEO from "../../../public/videos/CEO.avif";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CaseStudies() {
  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 md:py-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex md:flex-row flex-col xl:gap-0 lg:gap-10 md:gap-10 gap-20 items-center justify-center">
          <div className="md:w-1/2 w-full flex flex-col items-start gap-10 order-2">
            <div className="flex flex-row items-center justify-start gap-1">
              <MdHexagon />
              <h2 className="font-bold font-Euclid text-[#1e1e1e]">
                Case Studies
              </h2>
            </div>
            <p className="font-medium font-Poppins text-[#6f6f6f] -mt-5">
              We take pride in building strong relationships with our clients
              across homes, businesses, and families.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f]">
              “They’ve made running errands for my parents so easy. Reliable,
              kind, efficient, and highly recommend!”
            </p>
            <h2 className="font-bold font-Euclid text-[#1e1e1e]">
              Daniel P., Family Caregiver
            </h2>
            <div className="flex items-center gap-4 justify-between md:mt-0 mt-5">
              {/*Read More button*/}
              <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
                <Link
                  href="/faq"
                  className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
                >
                  Faq
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
              </div>
              <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
                <Link
                  href="/about"
                  className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
                >
                  Why choose us
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full md:mt-0 mt-10 order-1">
            <Image
              src={CEO}
              alt="truck-image"
              className="md:w-[400px] md:h-[400px] w-[200px] h-[200px] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
