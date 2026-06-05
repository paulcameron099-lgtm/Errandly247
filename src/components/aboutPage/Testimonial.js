'use client'
import React from 'react'
import { MdOutlineStar } from "react-icons/md";
import { motion } from 'framer-motion';

const Testimonials = [
  {
    desc: "“Errandly247 has completely changed how I manage my day. From deliveries to home services, everything gets done smoothly and on time!”",
    name: "Lisa M., Busy Professional",
  },
  {
    desc: "They’ve made running errands for my parents so easy. Reliable, kind, efficient and highly recommend!",
    name: "Daniel P., Family Caregiver",
  },
  {
    desc: "Errandly247’s drivers and handymen are top-notch. Booking was simple, and service was excellent.",
    name: "Faith N., Business Owner",
  },
];

export default function Testimonial() {
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
        <div className="flex md:flex-row flex-col items-center gap-5 justify-between w-full">
          <h2 className="font-bold font-Euclid md:text-[40px] text-[20px] text-[#1e1e1e] md:w-[40%] w-full">
            Trusted by Businesses, Driven by Excellence.
          </h2>
          <p className="font-medium font-Poppins text-[#6f6f6f] md:text-[18px] text-[15px] md:w-[40%] w-full">
            Our clients rely on Errandly247 for seamless, on-demand solutions
            that enhance efficiency and reliability. From individual customers
            to small businesses, organizations choose Errandly247 because we
            deliver consistent quality, real-time visibility, and the
            flexibility they need. See what they have to say about our
            commitment to excellence.
          </p>
        </div>
        <div className="w-full flex md:flex-row flex-col items-center justify-center gap-5 bg-white py-10 mt-14 rounded-lg">
          {Testimonials.map((test, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-5 px-10"
            >
              <div className="flex flex-row items-center gap-2">
                <span>
                  <MdOutlineStar />
                </span>
                <span>
                  <MdOutlineStar />
                </span>
                <span>
                  <MdOutlineStar />
                </span>
                <span>
                  <MdOutlineStar />
                </span>
                <span>
                  <MdOutlineStar />
                </span>
              </div>
              <p className="font-medium font-Poppins md:text-[15px] text-center text-[13px] text-[#1e1e1e]">
                {test.desc}
              </p>
              <p className="font-medium font-Poppins md:text-[12px] text-center text-[10px] text-[#1e1e1e]">
                {test.name}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
