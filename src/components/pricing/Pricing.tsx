import React from "react";
import HeaderLayout from "../../layout/HeaderLayout";
import PricingCnt from "./PricingCnt";
import Partner from "../sections/Partner";

export default function Pricing() {
  return (
    <>
      <div id="pricing">
        <div className="relative w-full">
          <HeaderLayout />
        </div>
        <PricingCnt />
        <Partner />
      </div>
    </>
  );
}
