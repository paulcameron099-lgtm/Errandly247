'use client'
import React from "react";
import ContactUse from "../contact/ContactUse";
import { motion } from "framer-motion";

export default function BusinessContent() {
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
            Reliable Assistance That Keeps Your Business Moving
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            Every successful business runs on efficiency — and that’s exactly
            what Errandly247 delivers. We provide on-demand business support
            services designed to simplify daily operations, reduce downtime, and
            help teams stay focused on what really matters: growth.
          </p>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            From courier and delivery runs to office errands, event
            coordination, and administrative support, Errandly247 acts as your
            trusted operations partner, ready to handle tasks promptly and
            professionally.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start -ml-[46px]">
              <div className="border border-gray-200 rotate-90 w-[10%] flex items-start" />
              <h5 className="font-bold font-Euclid text-[#1e1e1e] md:text-[19px] text-[17px] lg:w-[70%] w-full">
                &quot;Great businesses thrive on reliability. At Errandly247, we
                bring structure, precision, and consistency to every
                errand.&quot;
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Bridging the Gap Between Businesses and Customers
            </h2>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              Whether you’re a startup, small business, or established
              enterprise, our team adapts to your workflow — ensuring every
              delivery, pickup, or task is handled with care and attention to
              detail.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              A Smarter Approach to Business Efficiency
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                We understand that every organization has unique operational
                needs. That’s why Errandly247 offers customized business
                solutions that scale with your company. Need an urgent document
                delivered? Event materials set up? Regular courier services
                between branches? We make it happen — seamlessly and on
                schedule.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Our goal isn’t just to provide manpower — it’s to enhance
                productivity through reliable, tech-enabled, and professional
                support. With transparent pricing and a dedicated team,
                Errandly247 gives your business the flexibility it needs to
                operate smoothly, 24/7.
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Why Choose Errandly247?
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                On-Time Delivery — Timely and secure task completion for
                uninterrupted operations.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Professional Representation — Our team acts as an extension of
                your brand.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Flexible Support — From one-time requests to ongoing service
                contracts.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Dedicated Assistance — Real-time communication and responsive
                service.
              </li>
            </ol>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[18px] text-[15px] lg:w-[80%] w-full mt-5">
              No matter your industry or company size, Errandly247 is your
              reliable partner for smarter, faster, and more efficient business
              operations. Focus on growth — we’ll handle the rest. 📈✨
            </p>
          </div>
        </div>
        {/*contact content*/}
        <ContactUse />
      </motion.div>
    </>
  );
}
