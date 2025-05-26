'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import aboutImage from '../../../public/chart.png';
import { useRouter } from 'next/navigation';

export default function AboutUsSection() {

  const router = useRouter();

  return (
    <section id='about-us' className="relative w-full flex justify-center bg-white py-14 lg:pb-20 lg:pt-36 px-2 sm:px-12 lg:px-24 overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl top-10 left-0" />
        <div className="absolute w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-2xl bottom-10 right-0" />
      </div>

      <div className="lg:max-w-[85%] w-[92%] z-10 flex flex-col lg:flex-row items-center lg:gap-20 gap-5">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="lg:w-1/2"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#075e54] leading-tight mb-6">
            Crafting the Future of Intelligent Messaging
          </h2>
          <p className="text-base text-gray-700 mb-6">
            At <span className="font-semibold text-[#25d366]">Adwah</span>, we blend
            creativity and AI to help you build powerful, automated communication that connects.
            Our mission is to empower creators, marketers, and developers with tools that feel human
            — and perform like magic.
          </p>
          <p className="text-gray-600 text-base mb-8">
            With a growing global team, cutting-edge infrastructure, and a passion for innovation,
            we're pushing the boundaries of what messaging can do. Whether you&apos;re launching a product,
            scaling a business, or exploring AI — we&apos;re here to elevate your reach.
          </p>

          <div className="flex gap-6">
            <button onClick={() => {router.push('/#contact-us')}} className="bg-[#128c7e] text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              Contact Us
            </button>
            <button onClick={() => {router.push('/#contact-us')}} className="text-[#25d366] font-semibold hover:underline">
              Meet the Team →
            </button>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
          className="lg:w-1/2"
        >
          <div className="rounded-xl overflow-hidden shadow-2xl w-full">
            <Image
              src={aboutImage}
              alt="About us visual"
              className="rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
