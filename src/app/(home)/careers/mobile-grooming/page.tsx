import PersonalCareJobcnt from '@/components/mobile-grooming/PersonalCareJobcnt';
import PersonalCareJob from '@/components/mobile-grooming/PersonalCareJob';
import Partner from '@/components/sections/Partner';
import React from 'react'

export default function page() {
  return (
    <>
      <div className="w-full">
        <PersonalCareJob />
        <PersonalCareJobcnt />
        <Partner />
      </div>
    </>
  );
}
