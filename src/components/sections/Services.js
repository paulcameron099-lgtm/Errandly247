'use client'
import Link from 'next/link';
import React from 'react'
import { MdHexagon } from "react-icons/md";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion';

export default function Services() {
    const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <>
      <motion.div
        className="w-full md:px-10 px-5 md:py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex flex-row items-center justify-start gap-1 lg:-mb-7 md:-mb-3 mb-3">
          <MdHexagon />
          <h2 className="font-bold font-Euclid text-[#1e1e1e]">
            Our Services.
          </h2>
        </div>
        <div className="flex md:flex-row flex-col items-center justify-center">
          <div className="md:w-1/2 w-full">
            <p className="md:w-[80%] font-medium font-Poppins text-[#6f6f6f]">
              Our solutions are tailored to meet the unique demands of your
              daily life and business needs, providing speed, reliability, and
              flexibility every step of the way.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex flex-col gap-5 lg:mt-0 mt-5">
            <div className="flex flex-row items-center justify-between border-b border-b-black py-2">
              <p className="font-medium font-Euclid text-[#1e1e1e]">
                Home & Maintenance
              </p>
              {/*Leran More button*/}
              <Link
                href="/service/home-maintenance"
                className="font-normal font-Poppins text-[#1e1e1e] flex items-end justify-end"
              >
                Learn More
              </Link>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-b-black py-2">
              <p className="font-medium font-Euclid text-[#1e1e1e]">
                Personal & Lifestyle Services
              </p>
              {/*Learn More button*/}
              <Link
                href="/service/personal-lifestyle-services"
                className="font-normal font-Poppins text-[#1e1e1e] flex items-end justify-end"
              >
                Learn More
              </Link>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-b-black py-2">
              <p className="font-medium font-Euclid text-[#1e1e1e]">
                Senior & Family Assistance
              </p>
              {/*Learn More button*/}
              <Link
                href="/service/senior-family-assistance"
                className="font-normal font-Poppins text-[#1e1e1e] flex items-end justify-end"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
<div className="bg-[url('/images/serviceT.jpeg')] bg-cover bg-center bg-no-repeat md:my-20 my-10">
  {/* Content */}
  <div
    ref={ref}
    className="flex flex-col md:flex-row justify-center items-center text-center gap-10 md:gap-16 lg:gap-20 xl:gap-28 py-10 bg-black/60 text-white"
  >
    {[
      {
        number: 4,
        label: 'Years of Service Excellence',
        suffix: '+',
      },
      {
        number: 600,
        label: 'Tasks Completed Successfully',
        suffix: '+',
      },
      {
        number: 50,
        label: 'Neighborhoods & Businesses Served',
        suffix: '+',
      },
      {
        number: 99,
        label: 'On-Time Service Rate',
        suffix: '%',
      },
    ].map((item, i) => (
      <div
        key={i}
        className="flex flex-col items-center justify-center text-center"
      >
        <span className="text-4xl font-bold">
          {inView && (
            <CountUp
              end={item.number}
              duration={2}
              suffix={item.suffix}
              separator=","
            />
          )}
        </span>
        <h2 className="text-sm md:text-base mt-2">{item.label}</h2>
      </div>
    ))}
  </div>
</div>


      </motion.div>
    </>
  );
}
