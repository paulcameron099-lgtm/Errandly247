'use client'
import React from 'react'
import { MdHexagon } from "react-icons/md";
import truck2 from '../../../public/images/about3.jpeg'
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 py-30"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex flex-row items-center justify-start gap-1 mb-3">
          <MdHexagon />
          <h2 className="font-bold font-Euclid text-[#1e1e1e]">About Us</h2>
        </div>
        <div className="flex md:flex-row flex-col items-center justify-center">
          <div className="md:w-1/2 w-full flex flex-col items-start gap-5">
            <p className="md:w-[80%] w-full font-medium font-Poppins text-[#6f6f6f]">
              We specialize in providing seamless and reliable errand and
              personal services, ensuring individuals and businesses save time,
              stay organized, and enjoy stress-free support — whenever they need
              it.
            </p>
            <div className="flex items-center gap-4 justify-center md:mt-0 mt-5">
              {/*About button*/}
              <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
                <Link
                  href="/about"
                  className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
                >
                  About company
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 md:mt-3 mt-5">
              <div className="flex flex-row items-center gap-1">
                <span className="bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center text-white">
                  1
                </span>
                <p className="font-medium font-Poppins text-[#6f6f6f]">
                  On-Time Service
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center text-white">
                  2
                </span>
                <p className="font-medium font-Poppins text-[#6f6f6f]">
                  Affordable Solutions
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center text-white">
                  3
                </span>
                <p className="font-medium font-Poppins text-[#6f6f6f]">
                  Scalable Support
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full md:mt-0 mt-10">
            <Image
              src={truck2}
              alt="truck-image"
              className="w-[600px] rounded-2xl"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
