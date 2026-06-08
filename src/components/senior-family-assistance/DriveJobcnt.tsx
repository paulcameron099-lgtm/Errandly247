'use client'
import React from "react";
import JobInfo from "../job/JobInfo";
import { motion } from "framer-motion";

export default function DriveJobcnt() {
  return (
    <>
      <motion.div
        className="flex lg:flex-row flex-col justify-center gap-5 w-full md:px-10 px-5 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex flex-col items-start lg:w-[70%] w-full gap-10">
          <h3 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px] lg:w-[80%] w-full">
            Job Overview
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            As a Driver / Courier at Errandly247, you’ll provide safe, reliable,
            and timely transportation for clients and deliveries. This role
            includes package drop-offs, personal errands, local rides, and other
            transportation services. You’ll be a critical part of making sure
            errands are completed efficiently and on schedule.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start">
              <h5 className="font-bold font-Euclid text-[#6f6f6f] md:text-[15px] text-[12px] lg:w-[60%] w-full">
                Safe, timely, and friendly service is at the heart of what we
                do.
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Key Responsibilities
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Transport clients, packages, and deliveries safely and on time
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Follow assigned routes and schedules efficiently
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Communicate with clients regarding estimated arrival times and
                any delays
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Ensure packages and personal items are handled carefully
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Maintain accurate records of deliveries, mileage, and client
                interactions
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Report any incidents, delays, or concerns to the Errandly247
                team
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Collaborate with the scheduling team to optimize routes and
                service efficiency
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Requirements
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Valid driver’s license and clean driving record
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Proven experience in driving, courier services, or delivery
                preferred
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Strong time management and navigation skills
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Excellent communication and customer service skills
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Ability to work independently and handle multiple deliveries
                efficiently
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Reliable vehicle and ability to travel locally
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Flexible schedule to meet client needs
              </li>
            </ol>
          </div>
        </div>
        {/*contact content*/}
        <div className="lg:w-[30%] w-full">
          <JobInfo
            work="Full Time / Part Time"
            location="On-site only"
            time="Flexible shifts, typically 9 AM – 6 PM (may vary by client needs)"
          />
        </div>
      </motion.div>
    </>
  );
}
