import Partner from "@/components/sections/Partner";
import DriveJobcnt from "@/components/senior-family-assistance/DriveJobcnt";
import DriveJob from "@/components/senior-family-assistance/DriveJob";

export default function page() {
  return (
    <>
      <div className="w-full">
        <DriveJob />
        <DriveJobcnt />
        <Partner />
      </div>
    </>
  );
}
