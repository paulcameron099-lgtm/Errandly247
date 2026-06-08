"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const pricingData = {
  monthly: {
    Basic: {
      price: 99,
      benefits: [
        "Up to 5 errands per month",
        "Grocery & shopping assistance",
        "Package pickup and drop-off",
        "Basic home tasks (cleaning, laundry, etc.)",
        "Standard response times",
      ],
    },
    Business: {
      price: 199,
      benefits: [
        "Up to 12 errands per month",
        "Office errands & courier services",
        "On-demand deliveries & driving",
        "Event or meeting assistance",
        "Priority scheduling",
        "Dedicated support line",
      ],
    },
    Premium: {
      price: 299,
      benefits: [
        "Unlimited local errands (fair use policy)",
        "Dedicated personal assistant access",
        "Home maintenance coordination",
        "Custom scheduling & route planning",
        "Real-time task tracking",
        "24/7 VIP customer support",
      ],
    },
  },
  annual: {
    Basic: {
      price: 999,
      benefits: [
        "Up to 60 errands per year",
        "Grocery runs & shopping assistance",
        "Laundry and household errands",
        "Package pickup/drop-off",
        "Discounted rates on additional tasks",
        "Priority customer support access",
      ],
    },
    Business: {
      price: 1999,
      benefits: [
        "Up to 150 errands per year",
        "Office errands & document delivery",
        "On-demand transport & courier service",
        "Event coordination and setup assistance",
        "Quarterly service review & optimization",
        "Email and phone support",
      ],
    },
    Premium: {
      price: 2999,
      benefits: [
        "Unlimited local errands (fair use policy)",
        "Dedicated personal assistant access",
        "Full home and lifestyle management",
        "Custom scheduling and route planning",
        "Personalized errand coordination",
        "Annual strategy session for service optimization",
        "24/7 VIP support",
      ],
    },
  },
};

export default function PricingCnt() {
     const [isAnnual, setIsAnnual] = useState(false);

     const plans = isAnnual ? pricingData.annual : pricingData.monthly;
  return (
    <>
      <motion.section
        className="py-16 px-6 md:px-20 mt-28"
        id="pricing"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="text-center mb-10">
          <h2 className="md:text-4xl text-2xl font-bold font-Euclid text-[#1e1e1e]">
            We’ve got a plan that’s perfect for you.
          </h2>
          <p className="text-[#6f6f6f] mt-2 font-medium font-Poppins md:text-2xl text-xl">
            Choose the package that fits your lifestyle or business needs.
            Whether you need help once in a while or every single day — Errandly247 has you covered.
          </p>
          <div className="mt-6 flex justify-center items-center gap-4">
            <span
              className={`font-Poppins font-medium ${
                !isAnnual ? "text-black" : "text-[#6f6f6f]"
              }`}
            >
              Monthly
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
            <span
              className={`font-Poppins font-medium ${
                isAnnual ? "text-black" : "text-[#6f6f6f]"
              }`}
            >
              Annually
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([planName, planDetails]) => (
            <div
              key={planName}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-Euclid font-semibold text-gray-800 mb-2">
                {planName} Plan
              </h3>
              <p className="text-3xl font-Poppins font-bold text-blue-600">
                ${planDetails.price}
                <span className="text-sm text-[#6f6f6f] font-medium font-Poppins">
                  /{isAnnual ? "yr" : "mo"}
                </span>
              </p>
              <ul className="mt-6 space-y-2">
                {planDetails.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-600 font-medium font-Poppins"
                  >
                    <span className="text-green-500 mt-1 font-medium font-Poppins">
                      ✔
                    </span>{" "}
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition font-medium font-Poppins cursor-pointer">
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>
      </motion.section>
    </>
  );
}
