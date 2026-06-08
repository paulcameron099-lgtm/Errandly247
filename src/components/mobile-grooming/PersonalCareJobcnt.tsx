'use client'
import React from "react";
import JobInfo from "../job/JobInfo";
import { motion } from "framer-motion";


export default function PersonalCareJobcnt() {
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
            As a Mobile Grooming / Personal Care Specialist at Errandly247,
            you’ll provide in-home personal care services such as haircuts,
            styling, grooming, or wellness treatments. This role requires
            hands-on skill, professionalism, and excellent customer service,
            ensuring every client receives a safe, comfortable, and high-quality
            experience.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start">
              <h5 className="font-bold font-Euclid text-[#6f6f6f] md:text-[15px] text-[12px] lg:w-[60%] w-full">
                Bringing professional care directly to our clients’ homes —
                convenient, reliable, and personal.
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Key Responsibilities
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Provide in-home grooming or personal care services according to
                client preferences
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Communicate with clients to confirm appointments, services, and
                any special requests
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Maintain a clean, safe, and professional work environment during
                all visits
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Handle tools and equipment safely and efficiently
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Report any client concerns or service issues to the Errandly247
                team
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Manage time effectively to complete scheduled appointments on
                time
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Provide friendly, professional, and compassionate service
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Requirements
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Valid license or certification for hairstyling, barbering, or
                personal care (as required).
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Proven experience in grooming or personal care services
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Excellent communication and customer service skills
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Strong attention to detail and professionalism
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Ability to work independently and travel to client homes
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Flexible schedule to meet client needs
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Reliable transportation to travel between appointments
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
