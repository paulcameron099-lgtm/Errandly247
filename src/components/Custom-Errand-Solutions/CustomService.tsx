'use client'
import React from "react";
import { IoHome } from "react-icons/io5";
import { MdBusinessCenter } from "react-icons/md";
import { MdPersonPin } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { MdHexagon } from "react-icons/md";
import { motion } from "framer-motion";

const logistics = [
  {
    id: "/service/home-maintenance",
    title: "Home & Maintenance",
    desc: "Reliable and efficient home solutions, from plumbing and cleaning to repairs and handyman work — ensuring your home runs smoothly.",
    icon: <IoHome />,
    image: "/images/service1.jpeg",
    button: "Learn More",
  },
  {
    id: "/service/senior-family-assistance",
    title: "Senior & Family Assistance",
    desc: "Compassionate support for seniors and families — grocery runs, prescription pickups, and appointment assistance made easy.",
    icon: <MdPersonPin />,
    image: "/images/service5.jpeg",
    button: "Learn More",
  },
  {
    id: "/service/business-support-services",
    title: "Business Support Services",
    desc: "Streamlined assistance for offices and small businesses, including courier runs, document delivery, and event errands.",
    icon: <MdBusinessCenter />,
    image: "/images/service4.jpeg",
    button: "Learn More",
  },
];

export default function CustomService() {
  return (
    <>
      <motion.div
        className="w-[95%] bg-[#1e1e1e] flex flex-col justify-center items-center rounded-lg md:px-10 px-5 m-auto py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex lg:flex-row flex-col gap-2 items-center justify-between w-full py-10">
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-row items-center justify-start gap-1 mb-3 lg:w-1/2 w-full">
              <MdHexagon color="yellow" />
              <h2 className="font-bold font-Euclid text-yellow-500">
                Our Services
              </h2>
            </div>
            <p className="text-white lg:text-[40px] font-Euclid font-medium text-[20px] lg:w-[80%] w-full">
              Explore smart, reliable, efficient, and tailored logistics
              solutions for your business.
            </p>
          </div>
          <div className="flex lg:items-center items-start gap-4 justify-start lg:justify-center lg:w-1/2 w-full">
            {/*All services button*/}
            <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-white rounded-full ">
              <Link
                href="/service"
                className="font-Euclid font-medium md:text-[15px] text-white text-[10px] relative z-10 group-hover:text-black transition-colors duration-500"
              >
                All Services
              </Link>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
            </div>
          </div>
        </div>
        <div className="w-full grid lg:grid-cols-3 gap-6 md:grid-cols-2 grid-cols-1 items-center justify-center rounded-2xl m-auto">
          {logistics.map((logis) => (
            <Link
              key={logis.id}
              href={logis.id}
              className="group flex flex-col justify-center items-center rounded-2xl md:w-full w-[95%] overflow-hidden"
            >
              <div className="relative rounded-t-2xl overflow-hidden w-full">
                <Image
                  src={logis.image}
                  alt="cargo-images"
                  width="400"
                  height="100"
                  className="h-[150px] w-full transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0 pointer-events-none" />
                <span className="absolute top-5 left-5 text-[40px] text-white z-10">
                  {logis.icon}
                </span>
              </div>

              <div className="flex flex-col items-start justify-center border rounded-b-2xl border-gray-700 border-t-0 md:px-10 px-5 xl:h-[190px] lg:h-[200px] md:h-[300px] h-[150px] gap-2 w-full">
                <h2 className="font-Euclid font-bold text-white">
                  {logis.title}
                </h2>
                <p className="font-Poppins font-medium text-[#999999] md:text-[15px] text-[12px]">
                  {logis.desc}
                </p>
                <p className="font-Euclid font-bold text-white border-b border-b-gray-700 py-2">
                  {logis.button}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
}
