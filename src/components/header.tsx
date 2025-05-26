"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  return (
    <header className="bg-[#dcf8c6] text-black py-4 lg:py-6 sticky top-0 z-50 shadow-md w-full flex items-center justify-center">
      <div className="container px-4 flex items-center justify-between lg:max-w-screen-xl w-full">
        {/* Logo */}
        <Link href="/" className="text-2xl font-sans font-bold text-[#075e54] flex items-center gap-2">
          <Image src='/logo.png' alt='' width={100} height={100} className="h-[35px] w-[35px] rounded-[2px]" />
          Adwah
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="/#about-us" className="hover:text-[#25d366] text-[#128c7e] font-semibold transition">About Us</Link></li>
            <li><Link href="/#contact-us" className="hover:text-[#25d366] text-[#128c7e] font-semibold transition">Contact Us</Link></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-black focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        className="fixed top-0 left-0 h-full w-4/6 bg-[#dcf8c6] text-black z-50 shadow-lg transform md:hidden"
        initial="closed"
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", stiffness: 300, damping: 20 }}
      >
        <div className="p-4 flex justify-end">
          <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-black focus:outline-none">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col space-y-3">
            <li><Link href="/#about-us" className="hover:text-[#25d366] text-[#128c7e] font-semibold transition block py-2">About Us</Link></li>
            <li><Link href="/#contact-us" className="hover:text-[#25d366] text-[#128c7e] font-semibold transition block py-2">Contact Us</Link></li>
          </ul>
        </nav>
      </motion.div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;
