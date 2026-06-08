import CareJobcnt from '@/components/personal-lifestyle/CareJobcnt';
import CareJob from '@/components/personal-lifestyle/CareJob';
import Partner from '@/components/sections/Partner';

export default function page() {
  return (
    <>
      <div className="w-full">
        <CareJob />
        <CareJobcnt />
        <Partner />
      </div>
    </>
  );
}
