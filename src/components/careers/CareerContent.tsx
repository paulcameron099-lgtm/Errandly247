'use client'
import React from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CareerContent() {
  return (
    <>
      <motion.div
        className="mt-20 md:px-10 px-5 w-full py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="mb-8">
          <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[40px] text-[20px]">
            Join the Errandly247 Team
          </h2>
          <p className="font-medium font-Poppins text-[#1e1e1e] md:text-[25px] text-[15px]">
            We’re building a team of skilled, reliable, and friendly
            professionals who help our customers save time and simplify life. If
            you love helping people and delivering top-notch service, check out
            these opportunities:
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-10 w-full">
          {/* Repeat for each work item */}
          {[
            {
              id: "/careers/home-services-specialist",
              title: "Handyman / Home Services Specialist",
              description:
                "Perform home maintenance tasks including plumbing, repairs, furniture assembly, and other household fixes. Great for experienced tradespeople who are professional, punctual, and customer-focused.",
            },
            {
              id: "/careers/personal-shopper",
              title: "Personal Shopper / Purchasing Agent",
              description:
                "Shop for groceries, household items, or special orders, and deliver them safely to clients’ homes. Ideal for organized, detail-oriented individuals who know how to find quality items quickly.",
            },
            {
              id: "/careers/driver-courier",
              title: "Driver / Courier",
              description:
                "Provide safe and timely transportation for people or deliveries. Includes package drop-offs, errands, airport transfers, and local rides. Perfect for licensed drivers with a clean record and strong customer service skills.",
            },
            {
              id: "/careers/mobile-grooming",
              title: "Mobile Grooming / Personal Care Specialist",
              description:
                "Offer in-home grooming, haircuts, or personal care services to clients. Best suited for licensed stylists, barbers, or wellness professionals who enjoy flexible work and great customer interaction.",
            },
            {
              id: "/careers/caregiver-senior",
              title: "Caregiver / Senior & Family Assistant",
              description:
                "Support seniors and busy families with errands, companionship, prescription pickup, grocery delivery, and general assistance. Ideal for compassionate, reliable individuals with strong interpersonal skills.",
            },
          ].map((work) => (
            <div
              key={work.id}
              className="flex md:flex-row flex-col md:justify-between justify-start items-center border-b border-b-gray-300 py-5 md:items-center w-full"
            >
              {/* Text section */}
              <div className="flex flex-col items-start gap-2 md:w-[50%] w-full">
                <h2 className="font-bold font-Euclid text-[#1e1e1e] md:text-[20px] text-[15px]">
                  {work.title}
                </h2>
                <p className="font-medium font-Poppins text-[#6f6f6f] md:text-[17px] text-[12px] w-full">
                  {work.description}
                </p>
              </div>

              {/* Button */}
              <div className="relative flex items-center justify-center bg-white md:px-10 xl:w-[14%] lg:w-[20%] md:w-[25%] w-1/2 mt-5 md:mt-0 px-3 py-2 overflow-hidden group rounded-full">
                <Link
                  href={work.id}
                  className="font-Euclid font-medium md:text-[15px] text-[10px] flex items-center justify-center m-auto relative z-10 group-hover:text-white transition-colors duration-500"
                >
                  Read More
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
