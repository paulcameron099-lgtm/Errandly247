'use client'
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { MdHexagon } from "react-icons/md";
import abouttruck from '../../../public/images/athome.png'
import aboutship from '../../../public/images/business.png'
import aboutplane from '../../../public/images/onroad.png'
import { motion } from 'framer-motion';

export default function AboutContent() {
  return (
    <>
      <motion.div
        className="py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex md:flex-row flex-col justify-between items-center w-full md:px-10 px-5 gap-5">
          <h2 className="font-Euclid md:text-start text-center font-medium text-[#1e1e1e] md:text-[40px] text-[25px] xl:w-[45%] lg:w-[50%] md:w-[70%] w-full">
            Your tasks, handled with care.
          </h2>
          <div className="relative flex items-center gap-2 md:px-10 lg:w-[16%] md:w-[25%] w-1/2 px-3 py-2 overflow-hidden group border border-black rounded-full ">
            <Link
              href="/contact"
              className="font-Euclid font-medium md:text-[15px] text-[10px] flex items-center justify-center m-auto relative z-10 group-hover:text-white transition-colors duration-500"
            >
              Let&apos;s Talk
            </Link>
            <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
          </div>
        </div>
        <div className="flex xl:flex-row flex-col justify-between items-center w-full gap-10 py-10 md:px-10 px-5">
          <div className="flex flex-col bg-gray-500 xl:w-[40%] w-full py-10 pt-[111px] px-5 rounded-lg gap-5">
            <p className="font-medium font-Poppins text-white md:text-[25px]">
              At Errandly247, we are redefining convenience with our commitment
              to reliability, speed, and trust.
            </p>
            <p className="font-medium font-Poppins text-white">
              From personal errands to home repairs and business support, our
              team ensures that every task is completed efficiently,
              professionally, and right on time.
            </p>
          </div>
          <div className="flex lg:flex-row flex-col items-center justify-center gap-10 xl:w-fit w-full">
            <div className="flex flex-col gap-5 items-center justify-center bg-white px-5 py-4 pt-10 rounded-lg xl:w-[50%] w-full">
              <div className="flex flex-row items-center justify-center md:gap-6 gap-3 w-full">
                <div className="flex flex-row items-center gap-2">
                  <MdHexagon className="text-[20px] text-yellow-500" />
                  <p className="font-medium font-Poppins text-[15px]">At Home</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <MdHexagon className="text-[20px] text-yellow-500" />
                  <p className="font-medium font-Poppins text-[15px]">On Road</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <MdHexagon className="text-[20px] text-yellow-500" />
                  <p className="font-medium font-Poppins text-[15px]">
                    For Your Business
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-5 items-start">
                <Image
                  src={abouttruck}
                  alt="cargo-image"
                  className="w-80 h-24 rounded-lg"
                />
                <Image
                  src={aboutship}
                  alt="cargo-image"
                  className="w-80 h-20 rounded-lg"
                />
                <Image
                  src={aboutplane}
                  alt="cargo-image"
                  className="w-80 h-20 rounded-lg"
                />
              </div>
            </div>
            <div className="bg-orange-500 py-[102px] px-5 rounded-lg xl:w-[50%] w-full">
              <div className="flex flex-col items-center justify-center gap-4 md:mt-3 mt-5">
                <div className="flex flex-row items-center relative">
                  <span className="bg-black rounded-full absolute h-14 w-14 flex items-center justify-center text-white">
                    1
                  </span>
                  <p className="font-medium font-Poppins text-black bg-white rounded-full w-72 px-3 pl-[66px] py-3">
                    On-Time Service
                  </p>
                </div>
                <div className="flex flex-row items-center relative">
                  <span className="bg-black rounded-full absolute h-14 w-14 flex items-center justify-center text-white">
                    2
                  </span>
                  <p className="font-medium font-Poppins text-black bg-white rounded-full w-72 px-3 pl-[66px] py-3">
                    Affordable Solutions
                  </p>
                </div>
                <div className="flex flex-row items-center relative">
                  <span className="bg-black rounded-full absolute h-14 w-14 flex items-center justify-center text-white">
                    3
                  </span>
                  <p className="font-medium font-Poppins text-black bg-white rounded-full w-72 px-3 pl-[66px] py-3">
                    Scalable Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
