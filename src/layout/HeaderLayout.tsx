'use client'
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { RiMenu3Fill } from "react-icons/ri";
import Image from "next/image";
import logoBlack from "../../public/images/logoo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";


const menus = [
  { id: "/", label: "Home" },
  { id: "/about", label: "About Us" },
  { id: "/service", label: "Service" },
  { id: "/pricing", label: "Pricing" },
  {
    id: "#",
    label: "All Pages",
    submenu: [
      { id: "/about", label: "About Us" },
      { id: "/service", label: "Service" },
      { id: "/pricing", label: "Pricing" },
      { id: "/mission", label: "Mission" },
      { id: "/faq", label: "FAQ" },
      { id: "/contact", label: "Contact" },
      { id: "/careers", label: "Career" },
      { id: "/track", label: "Track" },
    ],
  },
];

const mobileMenus = [
  { id: "/", label: "Home" },
  { id: "/about", label: "About Us" },
  { id: "/service", label: "Services" },
  { id: "/pricing", label: "Pricing" },
  { id: "/mission", label: "Mission" },
  { id: "/faq", label: "FAQ" },
  { id: "/contact", label: "Contact" },
  { id: "/careers", label: "Career" },
  { id: "/track", label: "Track" },
];


export default function HeaderLayout() {
    const [scrolling, setScrolling] = useState(false);
    const [test, setTest] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
      setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
      setMobileMenuOpen(false);
    }, [scrolling]);
    
      useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY >= 80) {
            setScrolling(true);
            setTest(true);
          } else {
            setScrolling(false);
            setTest(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-50 flex w-full justify-center">
      {/* Transparent Header - Before Scroll */}
      <div
        className={`pointer-events-auto absolute top-2 w-[95%] rounded-b-lg bg-white transition-all duration-500 ease-in-out lg:h-20 h-22 ${
          scrolling
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
          <div className="flex justify-between py-2 md:px-20 px-5 bg-transparent">
            <Link href="/" className="md:mt-0 mt-2">
              <Image src={logoBlack} alt="logo" className="md:w-16 w-14" />
            </Link>
            <div className="gap-10 justify-center items-center hidden lg:flex">
              {menus.map((menu) => (
                <div key={menu.label} className="relative group">
                  <Link
                    href={menu.id}
                    className={`font-medium font-Euclid xl:px-3 py-2 ${
                      pathname === menu.id ? "text-yellow-500" : "text-black"
                    } hover:text-yellow-500`}
                  >
                    {menu.label}
                  </Link>
                  {menu.submenu && (
                    <div className="absolute w-[400px] grid grid-cols-3 top-full left-0 mt-7 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                      {menu.submenu.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.id}
                          className="block px-5 py-2 text-black hover:text-yellow-500 font-Euclid"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="lg:flex items-center gap-4 md:mt-0 mt-2 hidden">
              {/*login button*/}
              <div
                className={`relative flex items-center gap-2 md:px-5 px-3 py-2 overflow-hidden group ${
                  test ? "border border-black" : "border border-gray-800"
                }`}
              >
                <FaUser
                  className={`md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500 ${
                    test ? "text-white" : "text-yellow-500"
                  }`}
                />
                <Link
                  href="/login"
                  className={`font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500
                ${test ? "text-white" : "text-black"}`}
                >
                  Login
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></span>
              </div>
            </div>
            <div className="lg:hidden relative z-10 md:mt-3 mt-7">
             {mobileMenuOpen && !scrolling ? (
            <MdClose
              className="md:text-[40px] text-[24px] text-black cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
          ) : (
            <RiMenu3Fill
              className="md:text-[40px] text-[24px] text-black cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            />
          )}
          {mobileMenuOpen && !scrolling && (
                <div
                  className="flex justify-start items-start flex-col text-end gap-4 bg-white p-8 
                absolute md:top-10 top-[30px] right-0 mt-4 md:min-w-[400px] min-w-[300px] rounded-[5px] scale-up-center animate-slide-down"
                >
                  {mobileMenus.map((menu) => (
                  <Link
                  key={menu.id}
                  href={menu.id}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-Euclid font-medium"
                >
                  {menu.label}
                </Link>
                  ))}
                  <div className="flex items-center gap-4 md:mt-0 mt-2">
                    {/*login button*/}
                    <div
                      className={`relative flex items-center gap-2 md:px-5 px-3 py-2 overflow-hidden group ${
                        test ? "border border-black" : "border border-gray-800"
                      }`}
                    >
                      <FaUser
                        className={`md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500 ${
                          test ? "text-white" : "text-yellow-500"
                        }`}
                      />
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500
                ${test ? "text-white" : "text-black"}`}
                      >
                        Login
                      </Link>
                      <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* White Header - Slides In on Scroll */}
       <div
        className={`pointer-events-auto absolute top-2 w-[95%] rounded-b-lg bg-white shadow-lg transition-transform duration-500 ease-in-out lg:h-20 h-18 ${
          scrolling
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
          <div className="flex justify-between lg:py-2 md:py-0 md:px-20 px-5">
            <Link href="/" className="lg:mt-0 mt-2 md:mt-3">
              <Image src={logoBlack} alt="logo" className="md:w-16 w-14" />
            </Link>
            <div className="gap-10 justify-center items-center hidden lg:flex">
              {menus.map((menu) => (
                <div key={menu.label} className="relative group">
                  <Link
                    href={menu.id}
                    className={`font-medium font-Euclid xl:px-3 py-2 ${
                      pathname === menu.id ? "text-yellow-500" : "text-black"
                    } hover:text-yellow-500`}
                  >
                    {menu.label}
                  </Link>
                  {menu.submenu && (
                    <div className="absolute w-[400px] grid grid-cols-3 top-full left-0 mt-7 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                      {menu.submenu.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.id}
                          className="block px-5 py-2 text-black hover:text-yellow-500 font-Euclid"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="lg:flex items-center gap-4 md:mt-0 mt-2 hidden">
              {/*login button*/}
              <div
                className={`relative flex items-center gap-2 md:px-5 px-3 py-2 overflow-hidden group ${
                  test ? "border border-black" : "border border-gray-800"
                }`}
              >
                <FaUser
                  className={`md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500 ${
                    test ? "text-balck" : "text-yellow-500"
                  }`}
                />
                <Link
                  href="/login"
                  className={`font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500
                ${test ? "text-black" : "text-white"}`}
                >
                  Login
                </Link>
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></span>
              </div>
            </div>
            <div className="lg:hidden relative z-10 md:mt-3 mt-7">
              {mobileMenuOpen && scrolling ? (
                <MdClose
                  className="md:text-[40px] text-[24px] text-black cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                />
              ) : (
                <RiMenu3Fill
                  className="md:text-[40px] text-[24px] text-black cursor-pointer"
                  onClick={() => setMobileMenuOpen(true)}
                  color="black"
                />
              )}
              {mobileMenuOpen && scrolling && (
                <div
                  className="flex justify-start items-start flex-col text-end gap-4 bg-white p-8 
                absolute md:top-10 top-[30px] right-0 mt-4 md:min-w-[400px] min-w-[300px] rounded-[5px] scale-up-center animate-slide-down"
                >
                  {mobileMenus.map((menu) => (
                    <Link
                      key={menu.id}
                      href={menu.id}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-Euclid font-medium"
                    >
                      {menu.label}
                    </Link>
                  ))}
                  <div className="flex items-center gap-4 md:mt-0 mt-2">
                    {/*login button*/}
                    <div
                      className={`relative flex items-center gap-2 md:px-5 px-3 py-2 overflow-hidden group ${
                        test ? "border border-black" : "border border-gray-800"
                      }`}
                    >
                      <FaUser
                        className={`md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500 ${
                          test ? "text-balck" : "text-yellow-500"
                        }`}
                      />
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 group-hover:text-white transition-colors duration-500
                ${test ? "text-black" : "text-white"}`}
                      >
                        Login
                      </Link>
                      <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
