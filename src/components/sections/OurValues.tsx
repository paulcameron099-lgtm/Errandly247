'use client'
import React from 'react'
import { MdHexagon } from "react-icons/md";
import Image from 'next/image';
import smallblack from "../../../public/images/whitelogo.png";
import { SiSimpleanalytics } from "react-icons/si";
import { FaChartLine } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { motion } from 'framer-motion';

const values = [
  {
    icon: <SiSimpleanalytics />,
    title: "Reliability",
    desc: "We are always on time and dependable, giving our clients peace of mind that every task is handled.",
  },
  {
    icon: <FaChartLine />,
    title: "Efficiency",
    desc: "We streamline errands, reduce stress, and maximize productivity for your home, family, or business.",
  },
  {
    icon: <FaRegLightbulb />,
    title: "Innovation",
    desc: "We embrace smart scheduling, real-time updates, and easy booking to make your day effortless",
  },
];

export default function OurValues() {
  return (
    <>
      <motion.div
        className="w-[95%] bg-[#1b1b1b] py-20 my-20 md:px-20 px-10 flex flex-col justify-center items-center m-auto rounded-2xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex md:flex-row flex-col items-center justify-between gap-10">
          <div className="md:w-1/2 w-full">
            <div className="flex flex-row items-center justify-start gap-1 mb-3">
              <MdHexagon color="white" />
              <h2 className="font-bold font-Euclid text-white">Our Values</h2>
            </div>
            <p className="font-medium font-Poppins text-white md:w-full w-full md:text-[25px] text-[20px]">
              At Errandly247, we are committed to delivering reliable,
              efficient, and innovative errand and personal services while
              maintaining the highest standards of care.
            </p>
          </div>
          <div className="md:w-1/2 w-full md:flex justify-center md:justify-end hidden">
            <Image src={smallblack} alt="small-logo" className="w-60" />
          </div>
        </div>
        <div className="flex md:flex-row flex-col items-center gap-10 justify-center w-full mt-20">
          {values.map((value, i) => (
            <div
              key={i}
              className="md:w-[80%] w-full flex flex-col gap-2 items-center text-center justify-center"
            >
              <span className="text-black bg-yellow-500 py-2 px-2 rounded-full text-[20px]">
                {value.icon}
              </span>
              <h2 className="font-medium font-Poppins text-yellow-500">
                {value.title}
              </h2>
              <p className="font-medium font-Poppins text-white">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
