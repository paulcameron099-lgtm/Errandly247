'use client'
import React, {useState} from "react";
import textimage from "../../../public/images/contactpic.jpeg";
import Image from "next/image";
import { MdHexagon } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { MdMail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactContent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to send message. Please try again.");
      return;
    }

    setSuccess("Message sent! We will get back to you shortly.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    setError("Failed to send message. Please try again.");
  }
};


  return (
    <>
      <motion.div
        className="mt-20 md:px-10 px-5 py-20 w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        <p className="md:text-[40px] text-[20px] text-[#1e1e1e] lg:mb-7 font-bold font-Euclid md:w-[50%] w-full">
          Update your details or submit a request, and our team will respond
          promptly:
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p className="text-orange-500 text-2xl">{success}</p>}
        <div className="flex md:flex-row flex-col justify-center items-center gap-10 mt-20">
          <div className="md:w-1/2 w-full max-w-[700px] lg:h-[650px] h-[850px] rounded-3xl bg-white p-8 py-10 lg:p-11">
            <div className="flex flex-col">
              <div className="md:h-[450px] h-[600px] px-2 pb-3">
                <form
                  className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2"
                  onSubmit={handleSubmit}
                >
                  <div className="col-span-2 lg:col-span-1">
                    <label className="mb-1.5 block text-sm font-medium text-[#1e1e1e] font-Poppins">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      onChange={handleChange}
                      value={formData.firstName}
                      className="h-11 w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-[#999999] bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="mb-1.5 block text-sm font-medium text-[#1e1e1e] font-Poppins">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      onChange={handleChange}
                      value={formData.lastName}
                      className="h-11 w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-[#999999] bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="mb-1.5 block text-sm font-medium font-Poppins text-[#1e1e1e]">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      onChange={handleChange}
                      value={formData.email}
                      className="h-11 w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-[#999999] bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="mb-1.5 block text-sm font-medium font-Poppins text-[#1e1e1e]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      name="phone"
                      onChange={handleChange}
                      value={formData.phone}
                      className="h-11 w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-[#999999] bg-gray-100"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="address"
                      className="font-medium font-Poppins text-[#1e1e1e]"
                    >
                      Services
                    </label>
                    <select
                      name="service"
                      onChange={handleChange}
                      value={formData.service}
                      required
                      className="w-full px-4 py-2 rounded-md mb-2 bg-gray-100"
                    >
                      <option value="">Select Service</option>
                      <option value="Home & Maintenance">
                        Home & Maintenance
                      </option>
                      <option value="Transportation & Delivery">
                        Transportation & Delivery
                      </option>
                      <option value="Personal & Lifestyle">
                        Personal & Lifestyle
                      </option>
                      <option value="Business Support">Business Support</option>
                      <option value="Senior & Family Assistance">
                        Senior & Family Assistance
                      </option>
                      <option value="Custom Errand Solutions">
                        Custom Errand Solutions
                      </option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1.5 block text-sm font-medium font-Poppins text-[#1e1e1e]">
                      Your Message
                    </label>
                    <input
                      type="text"
                      placeholder="Your Message"
                      name="message"
                      onChange={handleChange}
                      value={formData.message}
                      className="h-11 w-full rounded-lg px-4 py-10 text-sm placeholder:text-[#999999] bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center justify-start gap-3 px-2 mt-6 w-full">
                    <button
                      variant="outline"
                      className="bg-yellow-500 cursor-pointer px-2 py-2 rounded-2xl text-white w-40 font-medium font-Poppins"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full relative">
            {/* Background Image */}
            <Image
              src={textimage}
              alt="contact-image"
              className="w-[700px] lg:h-[640px] md:h-[800px] h-[600px] object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-0" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-start justify-start p-8 mt-10">
              {/* Top heading */}
              <div className="flex flex-row items-center justify-start gap-2 mb-5">
                <MdHexagon className="text-yellow-500" size={24} />
                <h2 className="font-bold font-Euclid text-white text-[22px]">
                  Contact Us
                </h2>
              </div>

              {/* Main heading and description */}
              <div className="mb-8">
                <h3 className="font-bold font-Euclid text-white md:text-[30px] text-[20px] leading-tight">
                  We handle your errands and services with precision, care, and
                  reliability.
                </h3>
                <p className="font-medium font-Poppins text-white md:text-[18px] text-[14px] mt-4">
                  Whether it’s a quick task, home maintenance, personal service,
                  or business support, Errandly247 is here to make your life
                  easier — anytime, anywhere.
                </p>
              </div>

              {/* Office Info */}
              <div className="flex flex-col gap-4">
                <h2 className="font-bold font-Euclid text-white md:text-[24px] text-[18px]">
                  
                </h2>

                <div className="flex items-start gap-2">
                  <MdLocationPin className="text-white" />
                  <p className="font-medium font-Poppins text-white text-[14px]">
                    29 W 35th St #204, New York, NY 10001
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <MdMail className="text-white" />
                  <p className="font-medium font-Poppins text-white text-[14px]">
                    office@errandly247.com
                  </p>
                </div>

                <div className="flex items-start gap-2">
                <Link href="tel:+13309929035"><BsFillTelephoneFill className="text-white" /></Link>
                  <p className="font-medium font-Poppins text-white text-[14px]">
                    Phone US
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
