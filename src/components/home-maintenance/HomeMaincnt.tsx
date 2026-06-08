'use client'
import React from "react";
import ContactUse from "../contact/ContactUse";
import { motion } from "framer-motion";

export default function HomeMaincnt() {

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
        {/*freight content*/}
        <div className="flex flex-col items-start lg:w-[70&] w-full gap-10">
          <h3 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px] lg:w-[80%] w-full">
            Reliable and Efficient Home Solutions for Your Everyday Needs
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
            Keeping your home running smoothly is at the heart of what we do. At
            Errandly247, we provide individuals, families, and businesses with
            seamless, dependable, and professional home maintenance
            services—available anytime you need them. Whether it’s a plumbing
            fix, electrical repair, cleaning job, or full-home upkeep, we handle
            every task with precision and care.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start -ml-[46px]">
              <div className="border border-gray-200 rotate-90 w-[10%] flex items-start" />
              <h5 className="font-bold font-Euclid text-[#1e1e1e] md:text-[19px] text-[17px] lg:w-[70%] w-full">
                &quot;A well-maintained home brings peace of mind. Efficiency
                isn’t just a goal—it’s our standard.&quot;
              </h5>
            </div>
          </div>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
            From quick fixes to scheduled maintenance, our team ensures every
            job is carefully planned, executed, and completed on time. With
            trusted service partners and smart scheduling tools, Errandly247
            makes home management simple, transparent, and hassle-free.
          </p>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              A Smarter Approach to Home Care
            </h2>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
              We understand that every client has unique needs. That’s why
              Errandly247 offers flexible service options designed to fit your
              lifestyle, schedule, and budget. Whether you need an emergency
              plumber, a deep cleaning session, or routine home upkeep, our
              experts create a customized plan that works for you.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
              Our focus isn’t just on fixing problems — it’s on helping you
              maintain a safe, efficient, and comfortable home. By simplifying
              access to reliable professionals, we help you save time, reduce
              stress, and ensure every task is handled right the first time.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Why Choose Errandly247?
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                On-Time Performance — Prompt and professional service, every
                single time.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Expert Handling — Trusted specialists for plumbing, electrical,
                cleaning, and more.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Real-Time Updates — Stay informed with live status and
                communication.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Personalized Support — A dedicated team ready to assist with any
                home need.
              </li>
            </ol>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[18px] text-[15px] lg:w-[80%] w-full mt-5">
              No matter what your home requires — we’re here to help. Let’s keep
              your space running efficiently, beautifully, and stress-free. 🏡✨
            </p>
          </div>
        </div>
        {/*contact content*/}
        <ContactUse />
      </motion.div>
    </>
  );
}
