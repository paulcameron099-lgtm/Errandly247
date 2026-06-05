'use client'
import React from 'react'
import { MdLocationPin } from "react-icons/md";
import { MdMail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function ContactUse() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        {/*contact content*/}
        <div className="w-full relative">
          <div className="bg-white py-10 px-10 flex flex-col gap-7 items-start rounded-lg">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] lg:text-[25px] text-[17px] w-full">
              Have additional questions?
            </h2>
            <div className="border border-gray-300 w-full" />
            <div className="flex gap-1 w-full">
              <MdLocationPin />
              <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                29 W 35th St #204, New York, NY 10001
              </p>
            </div>
            <div className="flex gap-1 w-full">
              <MdMail />
              <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                office@errandly247.com
              </p>
            </div>
            <div className="flex gap-1 w-full">
            <Link href="tel:+13309929035"><BsFillTelephoneFill /></Link>
              <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Phone Us
              </p>
            </div>
            <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
              <Link
                href="/contact"
                className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
              >
                Contact Us
              </Link>
              <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
