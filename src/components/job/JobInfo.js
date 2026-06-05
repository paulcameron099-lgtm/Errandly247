'use client'
import React from "react";
import Link from "next/link";
import { MdMail } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function JobInfo({
  title = "Job Info",
  work,
  workIcon = <MdMail />,
  location,
  locationIcon = <MdLocationPin />,
  time,
  timeIcon = <FaClock />
}) {
  return (
    <>
      <motion.div
        className="w-full relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="bg-white py-10 px-10 flex flex-col gap-7 items-start rounded-lg">
          <h2 className="font-bold font-Euclid text-[#1e1e1e] lg:text-[25px] text-[17px] w-full">
            {title}
          </h2>
          <div className="border border-gray-300 w-full" />
          {/* Work */}
          <div className="flex gap-1 w-full items-center">
            {workIcon}
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
              {work}
            </p>
          </div>
          {/* Location */}
          <div className="flex gap-1 w-full items-center">
            {locationIcon}
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
              {location}
            </p>
          </div>
          {/* Time */}
          <div className="flex gap-1 w-full items-center">
            {timeIcon}
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
              {time}
            </p>
          </div>
          {/* Button */}
          <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black rounded-full">
            <Link
              href="/contact"
              className="font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500"
            >
              Apply now
            </Link>
            <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
