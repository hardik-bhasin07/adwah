// components/DemoStats.tsx
'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Rocket } from 'lucide-react';

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const lineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Messages Sent',
      data: [200, 450, 600, 700, 1000, 850, 900],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 5,
    },
  ],
};

const doughnutData = {
  labels: ['Delivered', 'Opened', 'Failed'],
  datasets: [
    {
      data: [70, 25, 5],
      backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
      borderWidth: 1,
    },
  ],
};

export default function DemoStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="w-full lg:py-20 py-14 px-6 bg-gradient-to-b from-white via-slate-50 to-white" id="demo" ref={ref}>
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[#25d366] font-semibold mb-2">
          <Rocket className="w-5 h-5" /> Real-Time Stats
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#075e54]">See How Powerful Your Campaigns Can Be</h2>
        <p className="text-gray-600 mt-2">Track performance and insights at a glance</p>
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 md:grid-cols-2 items-center lg:max-w-[70%] mx-auto lg:px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 h-full"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#128c7e]">Messages Sent Over the Week</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#128c7e]">Delivery Breakdown</h3>
          <div className='w-[250px] h-[250px]'><Doughnut  data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} /></div>
        </motion.div>
      </div>
    </section>
  );
}
