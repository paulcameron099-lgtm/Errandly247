'use client'
import React from "react";
import ContactUse from "../contact/ContactUse";
import { motion } from "framer-motion";

export default function CustomContent() {
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
        <div className="flex flex-col items-start lg:w-[70&] w-full gap-10">
          <h3 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px] lg:w-[80%] w-full">
            Tailored Services to Fit Your Unique Needs
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            No two days — or customers — are the same. That’s why at
            Errandly247, we go beyond standard tasks to offer custom errand
            solutions designed specifically for your lifestyle or business.
            Whether it’s coordinating multiple errands, handling time-sensitive
            deliveries, or managing special projects, we adapt to your unique
            requirements with precision and care.
          </p>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            Our flexible, all-in-one approach means you can combine services —
            like transport, shopping, home maintenance, and delivery — into one
            seamless experience. From individuals managing busy schedules to
            companies with recurring needs, Errandly247 provides the right
            people, tools, and timing to get it done.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start -ml-[46px]">
              <div className="border border-gray-200 rotate-90 w-[10%] flex items-start" />
              <h5 className="font-bold font-Euclid text-[#1e1e1e] md:text-[19px] text-[17px] lg:w-[70%] w-full">
                &quot;Whatever you need done, we’ll find a way to make it happen
                — efficiently, reliably, and on your schedule.&quot;
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              A Smarter Approach to Everyday Challenges
            </h2>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              We know that life doesn’t always fit into neat categories — and
              that’s where Errandly247 truly shines. Tell us what you need, and
              our team will create a personalized plan to execute it efficiently
              and affordably.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              From coordinating event setups and vendor pickups to handling
              last-minute errands, we ensure every task is completed with
              attention to detail, transparency, and professionalism.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Why Choose Errandly247?
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Fully Customizable — Services designed around your goals and
                schedule.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Reliable Execution — Every request handled with speed and
                accuracy.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Personal Support — Direct communication with our coordination
                team.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Available Anytime — 24/7 access to trusted help, whenever you
                need it.
              </li>
            </ol>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[18px] text-[15px] lg:w-[80%] w-full mt-5">
              Whatever the task, big or small — Errandly247 is your go-to
              partner for flexible, on-demand support that fits your life
              perfectly. Because no request is too specific when reliability is
              what we do best. ✨
            </p>
          </div>
        </div>
        {/*contact content*/}
        <ContactUse />
      </motion.div>
    </>
  );
}
