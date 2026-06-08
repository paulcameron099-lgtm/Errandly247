"use client";
import logowhite from "../../public/images/whitelogo.png";
import Image from "next/image";
import { FaFacebook, FaTiktok, FaPhone } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <>
      <motion.footer
        className="bg-[#1b1b1b] py-14 rounded-t-2xl w-[95%] m-auto md:px-10 px-5 flex flex-col justify-center items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="w-full md:px-20 flex md:flex-row flex-col justify-between md:items-center items-start md:gap-16 xl:gap-10 lg:gap-20 gap-10">
          <div className="flex flex-col gap-5 md:items-center items-start">
            <Image
              src={logowhite}
              alt="cagory-logo"
              className="lg:w-60 w-full"
            />
            <div className="flex flex-row items-center gap-5">
              <Link href="https://www.facebook.com/share/16Ri7RVmja/?mibextid=LQQJ4d">
                <FaFacebook className="text-white md:text-[24px] text-[40px]" />
              </Link>
              <Link href="https://www.tiktok.com/@errandly247?_r=1&_t=ZP-91RlHhvoMMJ">
                <FaTiktok className="text-white md:text-[24px] text-[40px]" />
              </Link>
              <Link href="tel:+13309929035">
                <FaPhone className="text-white md:text-[24px] text-[40px]" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="font-bold font-Euclid text-white">Contact</h1>
            <a
              href="https://g.page/r/CW_3vLxpyatHEAI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal font-Poppins text-white hover:underline md:text-[16px] leading-6"
            >
              29 W 35th St #204, New York, NY 10001
            </a>
            <a
              href="mailto:office@errandly247.com"
              className="font-normal font-Poppins text-white hover:underline"
            >
              office@errandly247.com
            </a>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="font-bold font-Euclid text-white">Services</h1>
            <Link
              href="/service/home-maintenance"
              className="font-normal font-Poppins text-white hover:underline"
            >
              Home & Maintenance
            </Link>
            <Link
              href="/service/personal-lifestyle-services"
              className="font-normal font-Poppins text-white hover:underline"
            >
              Personal & Lifestyle Services
            </Link>
            <Link
              href="/service/senior-family-assistance"
              className="font-normal font-Poppins text-white hover:underline"
            >
              Senior & Family Assistance
            </Link>
          </div>
        </div>
        <div className="mt-20">
          <p className="font-normal font-Poppins text-white">
            Errandly247® All rights reserved.
          </p>
        </div>
      </motion.footer>
    </>
  );
}
