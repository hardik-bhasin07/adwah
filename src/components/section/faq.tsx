'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const faqs = [
  {
    question: 'How can I integrate this tool into my existing workflow?',
    answer:
      'Our tool provides flexible APIs and easy-to-use SDKs so you can integrate it smoothly into your current applications without hassle.',
  },
  {
    question: 'What security measures are in place to protect my data?',
    answer:
      'We employ industry-standard encryption, regular audits, and secure data storage practices to ensure your data remains confidential and protected.',
  },
  {
    question: 'Can I customize the messages for different audience segments?',
    answer:
      'Absolutely! Our platform supports dynamic content and segmentation features to tailor your messages effectively.',
  },
  {
    question: 'Is there support for scheduling campaigns?',
    answer:
      'Yes, you can schedule campaigns for specific times and dates, with options for recurring sends and time zone adjustments.',
  },
  {
    question: 'What kind of analytics can I access?',
    answer:
      'Get detailed insights on delivery rates, open rates, click-throughs, and conversion metrics through our intuitive analytics dashboard.',
  },
];

export default function FAQProfessional() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-white to-gray-100 pb-20 pt-8 px-6 sm:px-10"
    >
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-center text-[#075e54] mb-14 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-6">
          {faqs.map(({ question, answer }, idx) => {
            const isOpen = idx === activeIndex;

            return (
              <motion.div
                key={idx}
                layout
                initial={{ borderRadius: 12, opacity: 0, y: 40 }}
                animate={
                  isInView
                    ? { borderRadius: isOpen ? 20 : 12, opacity: 1, y: 0 }
                    : {}
                }
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  opacity: { delay: 0.15 + idx * 0.08 },
                  y: { delay: 0.15 + idx * 0.08 },
                }}
                className="bg-white rounded-2xl shadow-md border border-gray-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center px-6 sm:px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-[#075e54] rounded-2xl group"
                >
                  <span className="text-lg sm:text-xl font-medium text-gray-900 group-hover:text-[#128c7e] transition-colors">
                    {question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-[#128c7e]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <motion.div
                        className="px-6 sm:px-8 pb-6 pt-2 text-gray-700 text-base sm:text-lg leading-relaxed border-t border-gray-100"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -5, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}