import Partner from "@/components/sections/Partner";
import PurchaseJob from "@/components/transport-delivery/PurchaseJob";
import PurchaseJobCnt from "@/components/transport-delivery/PurchaseJobCnt";

export default function page() {
  return (
    <>
      <div className="w-full">
        <PurchaseJob />
        <PurchaseJobCnt />
        <Partner />
      </div>
    </>
  );
}
