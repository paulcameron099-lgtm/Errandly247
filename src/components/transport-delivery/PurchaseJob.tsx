import React from 'react'

export default function PurchaseJob() {
  return (
    <>
      <div className="w-full md:px-10 px-5 md:mt-20 mt-40 md:py-10">
        <h2 className="font-Euclid font-bold text-[#1e1e1e] md:text-[80px] text-[30px]">
          Personal Shopper / Purchasing Agent
        </h2>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-[500px] object-cover -z-1 rounded-2xl my-10"
        >
          <source src="/videos/shopper.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
