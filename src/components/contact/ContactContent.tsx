"use client";

import React, { useState } from "react";
import textimage from "../../../public/images/contactpic.jpeg";
import Image from "next/image";
import { MdHexagon, MdLocationPin, MdMail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { motion } from "framer-motion";
import Link from "next/link";

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export default function ContactContent() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: { error?: string; message?: string } = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message. Please try again.");
        return;
      }

      setSuccess(data.message || "Message sent! We will get back to you shortly.");

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-20 w-full px-5 py-20 md:px-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      style={{ willChange: "opacity, transform" }}
    >
      <p className="w-full font-Euclid text-[20px] font-bold text-[#1e1e1e] md:w-[50%] md:text-[40px] lg:mb-7">
        Update your details or submit a request, and our team will respond
        promptly:
      </p>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {success && (
        <p className="mt-4 text-sm font-medium text-orange-500 md:text-xl">
          {success}
        </p>
      )}

      <div className="mt-20 flex flex-col items-center justify-center gap-10 md:flex-row">
        <div className="w-full max-w-[700px] rounded-3xl bg-white p-8 py-10 md:w-1/2 lg:p-11">
          <form
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />

            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
            />

            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            <div className="col-span-2">
              <label className="font-Poppins font-medium text-[#1e1e1e]">
                Services
              </label>

              <select
                name="service"
                onChange={handleChange}
                value={formData.service}
                required
                className="mt-1 w-full rounded-md bg-gray-100 px-4 py-3 text-sm outline-none"
              >
                <option value="">Select Service</option>
                <option value="Home & Maintenance">Home & Maintenance</option>
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
              <label className="mb-1.5 block font-Poppins text-sm font-medium text-[#1e1e1e]">
                Your Message
              </label>

              <textarea
                placeholder="Your Message"
                name="message"
                onChange={handleChange}
                value={formData.message}
                rows={5}
                required
                className="w-full resize-none rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none placeholder:text-[#999999]"
              />
            </div>

            <div className="col-span-2 mt-2 flex w-full items-center justify-start gap-3 px-2">
              <button
                type="submit"
                disabled={loading}
                className="w-40 cursor-pointer rounded-2xl bg-yellow-500 px-2 py-3 font-Poppins font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <div className="relative w-full md:w-1/2">
          <Image
            src={textimage}
            alt="contact-image"
            className="h-[600px] w-full object-cover md:h-[800px] lg:h-[640px]"
          />

          <div className="absolute left-0 top-0 z-0 h-full w-full bg-black/70" />

          <div className="absolute inset-0 mt-10 flex flex-col items-start justify-start p-8">
            <div className="mb-5 flex flex-row items-center justify-start gap-2">
              <MdHexagon className="text-yellow-500" size={24} />
              <h2 className="font-Euclid text-[22px] font-bold text-white">
                Contact Us
              </h2>
            </div>

            <div className="mb-8">
              <h3 className="font-Euclid text-[20px] font-bold leading-tight text-white md:text-[30px]">
                We handle your errands and services with precision, care, and
                reliability.
              </h3>

              <p className="mt-4 font-Poppins text-[14px] font-medium text-white md:text-[18px]">
                Whether it’s a quick task, home maintenance, personal service,
                or business support, Errandly247 is here to make your life
                easier — anytime, anywhere.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <MdLocationPin className="text-white" />
                <p className="font-Poppins text-[14px] font-medium text-white">
                  29 W 35th St #204, New York, NY 10001
                </p>
              </div>

              <div className="flex items-start gap-2">
                <MdMail className="text-white" />
                <p className="font-Poppins text-[14px] font-medium text-white">
                  office@errandly247.com
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Link href="tel:+13309929035">
                  <BsFillTelephoneFill className="text-white" />
                </Link>

                <p className="font-Poppins text-[14px] font-medium text-white">
                  Phone US
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type InputFieldProps = {
  label: string;
  name: keyof ContactFormData;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  type?: string;
};

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="col-span-2 lg:col-span-1">
      <label className="mb-1.5 block font-Poppins text-sm font-medium text-[#1e1e1e]">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        required
        className="h-11 w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm outline-none placeholder:text-[#999999]"
      />
    </div>
  );
}