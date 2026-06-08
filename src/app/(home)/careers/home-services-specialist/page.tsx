import HomeServiceContent from '@/components/home-service/HomeServiceContent';
import HomeServicecnt from '@/components/home-service/HomeServicecnt';
import Partner from '@/components/sections/Partner';

export default function page() {
  return (
    <>
      <div className="w-full">
        <HomeServiceContent />
        <HomeServicecnt />
        <Partner />
      </div>
    </>
  );
}
