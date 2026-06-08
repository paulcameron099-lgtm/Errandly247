'use client'
import React from 'react'
import ContactUse from '../contact/ContactUse';
import { motion } from 'framer-motion';

export default function PersonalContent() {
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
            On-Demand Personal Care, Wherever You Are
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            Life gets busy — and that’s where Errandly247 steps in. We bring
            trusted personal and lifestyle services directly to your doorstep,
            saving you time and effort while keeping you looking and feeling
            your best. From mobile barbers and beauty experts to laundry,
            shopping, and grooming, we make self-care and daily errands
            effortless and accessible — anytime you need them.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start -ml-[46px]">
              <div className="border border-gray-200 rotate-90 w-[10%] flex items-start" />
              <h5 className="font-bold font-Euclid text-[#1e1e1e] md:text-[19px] text-[17px] lg:w-[60%] w-full">
                &quot;Convenience should never compromise quality. At
                Errandly247, we bring professional services to you — reliably
                and with care.&quot;
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              A Smarter Approach to Personal Convenience
            </h2>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              We understand that everyone’s day-to-day needs are different.
              That’s why Errandly247 offers customizable personal services
              designed around your schedule, location, and preferences. Need a
              haircut at home, a nail tech for an event, or a trusted shopper to
              handle your errands? We’ve got you covered — 24/7.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              Our goal isn’t just to complete your errands — it’s to enhance
              your lifestyle through quality, reliability, and trust. With
              flexible booking, real-time communication, and verified
              professionals, Errandly247 makes everyday living simpler, smarter,
              and stress-free.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Why Choose Errandly247?
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Trusted Professionals — Experienced and verified experts for
                every service.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Convenience Redefined — Services that come to you, wherever you
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Easy Booking — Simple scheduling and instant confirmations.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Reliable & On-Time — We respect your time, always.
              </li>
            </ol>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[18px] text-[15px] lg:w-[80%] w-full mt-5">
              Whether it’s self-care, errands, or everyday tasks — Errandly247
              delivers the personal touch you deserve, right when you need it.
              Live smarter, stress less, and let us handle the rest. ✨
            </p>
          </div>
        </div>
        {/*contact content*/}
        <ContactUse />
      </motion.div>
    </>
  );
}
