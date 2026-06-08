'use client'
import React from "react";
import ContactUse from "../contact/ContactUse";
import { motion } from "framer-motion";

export default function TransportDeliverycontent() {

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
            Reliable and Efficient Transportation for Your Everyday Needs
          </h3>
          <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
            Getting you — or your items — where they need to be, safely and on
            time, is at the heart of what we do. At Errandly247, we provide
            individuals and businesses with seamless, efficient, and secure
            transportation and delivery solutions, available anytime, day or
            night. Whether you need a personal ride, a package delivered, or an
            urgent courier service, we make every trip smooth, reliable, and
            right on schedule.
          </p>
          <div>
            <div className="flex flex-row gap-1 items-center justify-start -ml-[46px]">
              <div className="border border-gray-200 rotate-90 w-[10%] flex items-start" />
              <h5 className="font-bold font-Euclid text-[#1e1e1e] md:text-[19px] text-[17px] lg:w-[70%] w-full">
                &quot;A dependable ride or delivery isn’t a luxury — it’s a
                necessity. Efficiency isn’t just a goal—it’s our standard.&quot;
              </h5>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              A Smarter Approach to Mobility
            </h2>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              We know every client’s transportation needs are unique. That’s why
              Errandly247 offers flexible mobility and delivery options designed
              to fit your schedule and budget. Need a quick ride to a meeting, a
              late-night airport transfer, or a same-day parcel delivery? We’ve
              got you covered — anytime, anywhere.
            </p>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[70%] w-full">
              Our goal isn’t just to move people or packages — it’s to deliver
              trust, convenience, and peace of mind. By optimizing routes and
              coordinating efficient handoffs, we help you save time, reduce
              waiting, and stay in control of every errand.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start">
            <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
              Why Choose Errandly247?
            </h2>
            <ol className="list-disc pl-5 flex flex-col items-start gap-5">
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                On-Time Performance — Reliable pickups and prompt deliveries.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Safe & Professional Drivers — Trained, verified, and
                customer-focused.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Real-Time Tracking — Stay updated every step of the way.
              </li>
              <li className="font-medium font-Poppins text-[#6f6f6f] lg:text-[15px] text-[12px] lg:w-[80%] w-full">
                Flexible Options — From personal rides to business logistics,
                tailored to your needs.
              </li>
            </ol>
            <p className="font-medium font-Poppins text-[#6f6f6f] lg:text-[18px] text-[15px] lg:w-[80%] w-full mt-5">
              From storage to final delivery, we help businesses optimize their
              supply chains, reduce costs, and improve distribution efficiency.
              Let’s streamline your logistics today! 🚛📦
            </p>
          </div>
        </div>
        {/*contact content*/}
        <ContactUse />
      </motion.div>
    </>
  );
}
