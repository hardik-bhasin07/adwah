'use client'
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const UseCase = () => {
    const contentBlockRef = useRef(null); // Ref for the main white content block

    useEffect(() => {
        const contentBlock : any = contentBlockRef.current;

        // Animate the main content block to fade in
        gsap.fromTo(
            contentBlock,
            { opacity: 0, y: 30 }, // Start slightly below and transparent
            {
                opacity: 1,
                y: 0,
                duration: 1, // Smooth duration
                ease: 'power3.out', // Smoother easing
                delay: 0.3, // A small delay before it starts
            }
        );

        // Animate its direct children (h2, p, and the grid div) to fade in
        gsap.fromTo(
            contentBlock.children, // Selects h2, p, and the grid div directly inside contentBlock
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.15,
                delay: 0.6,
            }
        );
    }, []);

    return (
        <div className="min-h-screen lg:w-[80%] bg-gradient-to-br from-[#e8f5df] to-[#f5ebe0] px-3 py-10 lg:p-4 flex items-center justify-center font-sans">
            <div
                ref={contentBlockRef} // Assign the ref here
                className="bg-white lg:p-6 p-5 rounded-3xl shadow-lg w-full max-w-[100%] lg:max-w-[95%] border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out flex flex-col items-center justify-center"
                style={{ opacity: 0 }} // Initially hide the block to allow GSAP to animate it in
            >
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-8 leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#075e54] to-[#128c7e]">
                        Unlock the Power of This Tool
                    </span>
                </h2>

                <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl mx-auto">
                    Discover how this innovative application can transform your outreach and marketing strategies.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                    {/* Use Case 1 */}
                    <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-xl hover:border-blue-200 hover:scale-[1.03]">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.343l-.707-.707m12.728 0l-.707.707M6 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-1.663M12 16a3 3 0 100-6 3 3 0 000 6z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            AI-Powered Content Creation
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                            Instantly generate engaging and concise ad messages tailored to your specific needs. Say goodbye to writer's block and save valuable time on copywriting.
                        </p>
                    </div>

                    {/* Use Case 2 */}
                    <div className="bg-green-50 p-6 rounded-2xl shadow-lg border border-green-100 flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-xl hover:border-green-200 hover:scale-[1.03]">
                        <div className="text-green-600 mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2h5M13 9a4 4 0 11-8 0 4 4 0 018 0zM12 14v-2m0 0V8m0 4h.01M12 12h.01"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Efficient Bulk Messaging
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                            Streamline your outreach by preparing to send your AI-generated ads to multiple WhatsApp contacts imported from an Excel file. Ideal for large-scale campaigns.
                        </p>
                    </div>

                    {/* Use Case 3 */}
                    <div className="bg-yellow-50 p-6 rounded-2xl shadow-lg border border-yellow-100 flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-xl hover:border-yellow-200 hover:scale-[1.03]">
                        <div className="text-yellow-600 mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H1m15 0a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Targeted Marketing Campaigns
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                            Perfect for businesses and marketers aiming to reach specific audiences with promotions, announcements, or personalized customer engagement messages.
                        </p>
                    </div>

                    {/* Use Case 4 */}
                    <div className="bg-red-50 p-6 rounded-2xl shadow-lg border border-red-100 flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-xl hover:border-red-200 hover:scale-[1.03]">
                        <div className="text-red-600 mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V3m0 9v3m0-3c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Boost Sales & Engagement
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                            Leverage the direct communication channel of WhatsApp to drive conversions, announce new products, or keep your audience informed and engaged.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseCase;