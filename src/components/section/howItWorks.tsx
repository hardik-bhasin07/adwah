// components/HowItWorks.tsx
'use client';

import { Sparkles, PencilLine, Eye, Send, ImageIcon, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: <PencilLine className="w-6 h-6 text-blue-600" />,
    title: 'Enter Your Prompt',
    description: 'Start by typing a short message idea or description of your offer.',
  },
  {
    icon: <ImageIcon className="w-6 h-6 text-pink-500" />,
    title: 'Post Image',
    description: 'Upload an image to make your WhatsApp ad more engaging.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-purple-600" />,
    title: 'AI Generates Ad Copy',
    description: 'Our AI instantly creates compelling WhatsApp message content for you.',
  },
  {
    icon: <Eye className="w-6 h-6 text-green-600" />,
    title: 'Preview & Customize',
    description: 'Review the message and tweak it with emojis, tone, or media.',
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6 text-orange-500" />,
    title: 'Add Contact Excel Sheets',
    description: 'Upload your contact list using Excel or CSV for bulk messaging.',
  },
  {
    icon: <Send className="w-6 h-6 text-emerald-600" />,
    title: 'Send to Contacts',
    description: 'Send the message in bulk directly through WhatsApp API.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 w-full lg:py-20 py-10 lg:px-6" id="how-it-works">
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#075e54]">How It Works</h2>
        <p className="text-gray-600 mb-10">From prompt to delivery in just a few clicks</p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#128c7e]">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
