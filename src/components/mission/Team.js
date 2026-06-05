'use client'
import React from "react";
import { MdHexagon } from "react-icons/md";
import Image from "next/image";
import smallblack from "../../../public/images/whitelogo.png";
import james from "../../../public/images/team3.jpeg";
import sophia from "../../../public/images/team1.jpeg";
import daniel from "../../../public/images/team2.jpeg";
import { motion } from "framer-motion";

const teams = [
  {
    image: james,
    name: "Haley Warren",
    role: "Founder & CEO",
  },
  {
    image: sophia,
    name: "Clayton Snegur",
    role: "Head of Operations & Service Innovation",
  },
  {
    image: daniel,
    name: "Rio Flores-Sanchez",
    role: "Client Experience & Logistics Manager",
  },
];

export default function Team() {
  return (
    <>
      <motion.div
        className="w-[95%] bg-[#1b1b1b] py-20 my-20 md:px-20 px-10 flex flex-col justify-center items-center m-auto rounded-2xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex md:flex-row flex-col items-center justify-between gap-10">
          <div className="md:w-1/2 w-full">
            <div className="flex flex-row items-center justify-start gap-1 mb-3">
              <MdHexagon color="yellow" />
              <h2 className="font-bold font-Euclid text-yellow-500">
                Our team
              </h2>
            </div>
            <p className="font-medium font-Poppins text-white md:w-full w-full md:text-[40px] text-[20px]">
              Meet the people making it happen at Errandly247:
            </p>
          </div>
          <div className="md:w-1/2 w-full md:flex justify-center md:justify-end hidden">
            <Image src={smallblack} alt="small-logo" className="w-60" />
          </div>
        </div>
        <div className="flex md:flex-row flex-col items-center gap-10 justify-center w-full mt-20">
          {teams.map((team, i) => (
            <div
              key={i}
              className="md:w-[80%] w-full flex flex-col gap-2 items-center text-center justify-center"
            >
              <Image src={team.image} alt="team-image" className="w-96 h-72" />
              <h2 className="font-medium font-Poppins text-yellow-500">
                {team.name}
              </h2>
              <p className="font-medium font-Poppins text-white">{team.role}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
