'use client';
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactUs() {
  return (
    <section id='contact-us' className="relative w-full bg-[#075e54] py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center text-white relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Have Questions? Let's Chat on WhatsApp
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-10 text-gray-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're here to help you craft the perfect ad. Tap below to start a conversation instantly.
        </motion.p>

        <motion.a
          href="https://wa.me/919310078853?text=Hey%20Team,%20I%20have%20a%20question%20about%20your%20ad%20tool."
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl transition duration-300"
        >
          <MessageCircle className="text-2xl" />
          Chat on WhatsApp
        </motion.a>
      </div>

      {/* Glowing blurred background elements */}
      <div className="absolute top-10 left-0 w-48 h-48 bg-green-400 opacity-20 blur-3xl rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-0 w-56 h-56 bg-teal-500 opacity-20 blur-3xl rounded-full -z-10 animate-pulse"></div>
    </section>
  );
}
