'use client'
import React from 'react'
import { IoHome } from "react-icons/io5";
import { FaCarSide } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const cargos = [
  {
      id: "/service/home-maintenance",
      title: "Home & Maintenance",
      desc: "Reliable and efficient home solutions, from plumbing and cleaning to repairs and handyman work — ensuring your home runs smoothly.",
      icon: <IoHome />,
      image: "/images/service1.jpeg",
      button: "Learn More",
    },
  {
      id: "/service/transportation-delivery",
      title: "Transportation & Delivery",
      desc: "Streamlined storage and distribution services to optimized your supply chain",
      icon: <FaCarSide />,
      image: "/images/service2.jpeg",
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

export default function HeroPart() {
  return (
    <>
      <motion.div
        className="w-[95%] py-10 bg-white flex md:flex-row gap-3 flex-col items-center justify-center -mt-36 rounded-2xl z-10 relative m-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        {cargos.map((cargo) => (
          <Link
            href={cargo.id}
            key={cargo.id}
            className="flex flex-col justify-center items-center bg-gray-100 md:w-[30%] rounded-2xl w-[95%]"
          >
            <div className="relative overflow-hidden group rounded-t-2xl">
              <Image
                src={cargo.image}
                alt="cargo-images"
                width="400"
                height="100"
                className="h-[150px] w-[600px] transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0 pointer-events-none" />
              <span className="absolute top-5 left-5 text-[40px] text-white z-10">
                {cargo.icon}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center md:px-10 px-5 xl:h-[190px] lg:h-[200px] md:h-[300px] h-[150px] gap-2">
              <h2 className="font-Euclid font-bold text-[#1e1e1e]">
                {cargo.title}
              </h2>
              <p className="font-Poppins font-medium text-[#6f6f6f] md:text-[15px] text-[12px]">
                {cargo.desc}
              </p>
              <p className="font-Euclid font-bold text-[#1e1e1e] border-b border-b-gray-400">
                {cargo.button}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>
    </>
  );
}
