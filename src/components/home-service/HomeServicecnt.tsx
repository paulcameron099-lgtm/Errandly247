'use client'
import React from "react";
import JobInfo from "../job/JobInfo";
import { motion } from "framer-motion";


export default function HomeServicecnt() {
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
            As a Handyman / Home Services Specialist at Errandly247, you’ll play
            a key role in helping clients maintain and improve their homes.
            You’ll provide hands-on assistance with household tasks such as
            minor repairs, furniture assembly, general upkeep, and light
            maintenance. This role requires practical skills, strong
            communication, and a proactive attitude to ensure every client’s
            home runs smoothly.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start">
              <h5 className="font-bold font-Euclid text-[#6f6f6f] md:text-[15px] text-[12px] lg:w-[60%] w-full">
                You’ll work directly with clients to understand their needs,
                complete tasks efficiently, and provide a reliable, high-quality
                service experience. Your work will directly impact client
                satisfaction and the reputation of Errandly247.
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Key Responsibilities
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Perform a variety of household tasks including minor repairs,
                furniture assembly, and general home maintenance
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Communicate with clients to confirm tasks, schedules, and
                service expectations
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Ensure tasks are completed efficiently, safely, and to a high
                standard
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Report any issues, damages, or additional needs to the
                scheduling team
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Maintain accurate records of completed tasks and time spent on
                assignments
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Collaborate with other Errandly247 professionals to provide
                seamless client experiences
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Follow company policies for safety, professionalism, and client
                care
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Requirements
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Proven experience in home maintenance, repairs, or related
                services
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Strong practical skills and problem-solving abilities
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Excellent communication and customer service skills
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Ability to work independently and manage multiple tasks
                efficiently
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Attention to detail and commitment to high-quality work
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Valid driver’s license preferred, but not required
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Flexible schedule and willingness to work on-site at client
                locations
              </li>
            </ol>
          </div>
        </div>
        {/*contact content*/}
        <div className="lg:w-[30%] w-full">
          <JobInfo
            work="Full Time / Part Time"
            location="On-site / Hybrid scheduling"
            time=" Flexible shifts, typically 9 AM – 6 PM (may vary by client needs)"
          />
        </div>
      </motion.div>
    </>
  );
}
