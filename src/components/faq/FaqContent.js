"use client";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { motion } from "framer-motion";

export default function FaqContent() {
  // Track only ONE open section, not multiple
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    // If clicking the already open one, close it; otherwise open the clicked one
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const reads = [
    {
      question: "What services do you offer?",
      answer:
        "Errandly247 provides a wide range of on-demand services, including: HOME & MAINTENANCE (plumbing, cleaning, repairs), TRANSPORTATION & DELIVERY (rides, package drop-offs, courier service), PERSONAL & LIFESTYLE (haircuts, grooming, shopping, laundry), BUSINESS SUPPORT (office errands, document delivery, event assistance), SENIOR & FAMILY ASSISTANCE (grocery runs, prescriptions, companionship), CUSTOM ERRAND SOLUTIONS TAILORED TO YOUR UNIQUE NEEDS",
    },
    {
      question: "How do you ensure timely service?",
      answer:
        "Our team uses smart scheduling, route optimization, and real-time communication to make sure every task is completed on time, every time. We also provide updates so you know exactly when your errands are done.",
    },
    {
      question: "Can I track my errands or deliveries in real time?",
      answer:
        "Yes! With our platform, you can track your tasks and deliveries live, receive notifications, and communicate directly with your assigned Errandly247 professional.",
    },
    {
      question: "Can I request a custom errand solution?",
      answer:
        "Absolutely. No task is too specific. Just tell us what you need, and we’ll create a personalized plan to execute it efficiently and reliably.",
    },
    {
      question: "Do you offer services for both individuals and businesses?",
      answer:
        "Yes. We work with individuals, families, and businesses of all sizes to provide flexible, on-demand assistance tailored to your needs.",
    },
    {
      question: "What pricing plans do you offer?",
      answer:
        "We offer monthly and annual plans for individuals and businesses, with options ranging from basic support to unlimited premium service. Plans include errands, deliveries, home services, and more — all scalable to fit your lifestyle or business.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "Errandly247 currently serves all states in the United States, with plans to expand as demand grows.",
    },
    {
      question: "Do you provide insurance or guarantee for services?",
      answer:
        "Yes. All Errandly247 services are performed by verified professionals, and we provide accountability measures and guarantees to ensure every task is handled safely and reliably.",
    },
  ];

  return (
    <>
      <motion.div
        className="w-full md:py-[60px] py-10"
        id="faqs"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="mt-16 lg:px-24 px-10">
          {reads.map((read, index) => (
            <div key={index} className="border-b-2 border-gray-300 mb-5">
              <div
                className="flex justify-between items-center cursor-pointer mb-3"
                onClick={() => toggleSection(index)}
              >
                <h2 className="font-bold text-[20px] font-Euclid text-[#1e1e1e]">
                  {read.question}
                </h2>
                {openIndex === index ? (
                  <MdOutlineKeyboardArrowDown
                    size={20}
                    className="bg-black rounded-full w-10 h-10 text-white p-2"
                  />
                ) : (
                  <MdKeyboardArrowUp
                    size={20}
                    className="bg-black rounded-full w-10 h-10 text-white p-2"
                  />
                )}
              </div>

              {/* Animated answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[17px] font-medium font-Poppins w-full text-[#6f6f6f] pb-5">
                  {read.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
