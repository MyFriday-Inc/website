'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load EmailDemo component
const EmailDemo = dynamic(() => import('./demo/EmailDemo'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-[#11d0be]/10 to-[#FF6B35]/10 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading demo...</div>
    </div>
  )
});

export default function HowItWorks() {
  const [isInView, setIsInView] = useState(false);
  const [shouldLoadDemo, setShouldLoadDemo] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
        // Load demo when section is 200px away from viewport
        if (entry.boundingClientRect.top < window.innerHeight + 200 && !shouldLoadDemo) {
          setShouldLoadDemo(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '100px 0px'
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [isInView, shouldLoadDemo]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const demoVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 30
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="py-8 sm:py-12 md:py-20 bg-white relative overflow-hidden"
    >
      {/* Static Background gradients - no animations */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/10 blur-3xl opacity-100"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full bg-[#FF6B35]/10 blur-3xl opacity-100"></div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-6 sm:mb-8 md:mb-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="overflow-hidden mb-2" variants={itemVariants}>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 mb-4">
              <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mr-1.5"></span>
              Beta
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
              Experience <span className="bg-gradient-to-r from-[#0d9488] to-[#11d0be] bg-clip-text text-transparent">Friday</span> in Email
            </h2>
          </motion.div>
          
          <motion.div 
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            <p>
              Friday lives in your <span className="text-[#FF6B35] font-medium">inbox</span>, proactively strengthening your existing relationships. It tracks your circles, suggests meaningful hangouts, and coordinates plans so you stay connected with the people who matter most.
            </p>
          </motion.div>
        </motion.div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-10">
          
          {/* Left side - Features */}
          <motion.div 
            className="space-y-4 sm:space-y-5 order-2 md:order-1"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            
            {/* Feature 1 */}
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#11d0be]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#11d0be]/20 transition-colors duration-300">
                <svg className="w-4 h-4 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 012.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 00.178.643l2.457 2.457a.678.678 0 00.644.178l2.189-.547a1.745 1.745 0 011.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 01-7.01-4.42 18.634 18.634 0 01-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Relationship <span className="text-[#FF6B35]">Radar</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Friday tracks when it&apos;s been <span className="text-[#FF6B35] font-medium">too long</span> and proactively suggests hangouts with specific people in your circles, so relationships don&apos;t drift and friendships stay strong.</p>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#11d0be]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#11d0be]/20 transition-colors duration-300">
                <svg className="w-4 h-4 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Vibe-Based <span className="text-[#FF6B35]">Venues</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Not just any restaurant Friday suggests places based on <span className="text-[#FF6B35] font-medium">what people actually say</span> about them, the energy they create, or perfect virtual alternatives that match the mood you&apos;re going for.</p>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#11d0be]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#11d0be]/20 transition-colors duration-300">
                <svg className="w-4 h-4 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Circle <span className="text-[#FF6B35]">Coordination</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Friday knows your different groups and coordinates within them, or suggests <span className="text-[#FF6B35] font-medium">cross-circle connections</span> when it makes sense to deepen relationships and expand your social world.</p>
              </div>
            </motion.div>
            
          </motion.div>
          
          {/* Right side - Demo */}
          <motion.div
            className="relative z-10 order-1 md:order-2"
            variants={demoVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="bg-gradient-to-br from-[#11d0be]/10 via-transparent to-[#FF6B35]/10 p-3 sm:p-4 md:p-5 rounded-2xl transform scale-90 sm:scale-95 md:scale-100 mx-auto max-w-sm sm:max-w-md md:max-w-none">
              {shouldLoadDemo ? (
                <EmailDemo />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-[#11d0be]/10 to-[#FF6B35]/10 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-500 text-sm">Preparing demo...</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Final tagline */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-lg text-gray-700 font-medium">
            No more <span className="text-[#FF6B35] font-semibold">47-message group chats</span> about brunch or relationships drifting apart Friday just makes it happen.
          </p>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button 
            className="bg-gradient-to-r from-[#11d0be] to-[#0fbfaf] hover:from-[#0fbfaf] hover:to-[#0ea89a] text-black font-semibold py-2.5 px-7 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm border border-[#11d0be]/20 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(17, 208, 190, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const section = document.getElementById('signup-section');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Early Access
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}