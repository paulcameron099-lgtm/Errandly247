'use client'
import React from "react";
import ContactUse from "../contact/ContactUse";
import { motion } from "framer-motion";

export default function SeniorContent() {
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
            Compassionate Support for Your Loved Ones
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            At Errandly247, we understand that caring for family — especially
            seniors — takes time, trust, and reliability. That’s why we provide
            dedicated assistance services designed to make everyday life easier,
            safer, and more comfortable for your loved ones.
          </p>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            From grocery runs and prescription pickups to companionship errands
            and appointment assistance, our trusted team ensures that every task
            is handled with care, respect, and attention to detail.
          </p>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            Whether you need one-time help or ongoing support, we make sure
            every errand is completed smoothly, with the same level of
            dedication and professionalism we’d want for our own families.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start -ml-[46px]">
              <div className="border border-gray-200 rotate-90 w-[10%] flex items-start" />
              <h5 className="font-bold font-Euclid text-[#1e1e1e] md:text-[19px] text-[17px] lg:w-[70%] w-full">
                &quot;Peace of mind comes from knowing your loved ones are cared
                for — that’s what Errandly247 is here to provide.&quot;
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px] lg:w-[80%] w-full">
              A Smarter Approach to Family Care
            </h2>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              We know that every household’s needs are different. Errandly247
              offers flexible assistance options that fit your family’s schedule
              — from weekly errands to full-time support plans. Need help
              transporting a loved one to an appointment? Picking up medication?
              Managing household tasks? We’re just a call away.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              Our approach goes beyond errands — it’s about building trust and
              connection. By combining reliability, empathy, and efficient
              service, Errandly247 helps families save time, reduce stress, and
              stay connected to what truly matters.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px] lg:w-[80%] w-full">
              Why Choose Errandly247?
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Compassionate Service — Friendly, respectful, and reliable
                support every time.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Safe & Trusted Assistance — Verified helpers who treat your
                family like their own.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Flexible Scheduling — Choose when and how often you need help.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Real-Time Updates — Stay informed and reassured throughout every
                service.
              </li>
            </ol>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[18px] text-[15px] lg:w-[80%] w-full mt-5">
              Whether it’s helping parents, grandparents, or busy households,
              Errandly247 is here to make life simpler, safer, and more
              connected. Because caring for family should never be a struggle —
              it should be effortless. 💛
            </p>
          </div>
        </div>
        {/*contact content*/}
        <ContactUse />
      </motion.div>
    </>
  );
}
