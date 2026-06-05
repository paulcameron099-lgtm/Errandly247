'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import smallblack from "../../../public/images/whitelogo.png";
import { motion } from 'framer-motion';

export default function Partner() {
  return (
    <>
      <motion.div
        className="flex md:flex-row flex-col justify-center items-center md:-space-x-16 w-full md:px-10 px-3 md:py-20 py-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="w-full">
          <Image
            src={smallblack}
            alt="cargory-image"
            className="flex justify-center items-center bg-[#1e1e1e] xl:py-6 lg:py-[120px] md:py-[170px] py-10 md:w-[90%] w-full px-10 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
          />
        </div>
        <div className="w-full flex flex-col items-start justify-start gap-7 bg-white py-[67px] md:pl-10 pl-5 pr-2 md:rounded-r-2xl md:rounded-b-none rounded-b-2xl">
          <h2 className="font-bold font-Euclid text-[#1e1e1e] text-[40px] xl:w-[60%]">
            Partner with Errandly247 Today!
          </h2>
          <p className="font-medium font-Poppins text-[#6f6f6f]">
            Looking for reliable, efficient, and scalable errand solutions? Let
            Errandly247 handle your personal tasks, home services, and business
            errands with precision, care, and round-the-clock support.
          </p>
          <div className="flex items-center gap-4 justify-between md:mt-0 mt-5">
            {/*work with us & get a quote button*/}
            <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
              <Link
                href="/contact"
                className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
              >
                Get a quote
              </Link>
              <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
            </div>
            <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full ">
              <Link
                href="/careers"
                className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
              >
                Work with us
              </Link>
              <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-row items-center gap-1">
              <span>📦</span>
              <p className="font-normal font-Poppins text-[#6f6f6f]">
                Seamless Service
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span>🚚</span>
              <p className="font-normal font-Poppins text-[#6f6f6f]">
                Flexible Solutions
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span>⌛</span>
              <p className="font-normal font-Poppins text-[#6f6f6f]">
                On-Time Performance
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
