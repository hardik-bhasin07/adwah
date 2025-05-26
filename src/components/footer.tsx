'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#075e54] border-t border-[#128c7e] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left: App Name */}
        <span className="text-lg text-[#dcf8c6] font-semibold tracking-wide">
          Adwah
        </span>

        {/* Right: Copyright */}
        <span className="text-sm mt-2 md:mt-0 text-[#ece5dd]">
          © {new Date().getFullYear()} Adwah. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
