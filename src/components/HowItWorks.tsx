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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
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
              Friday lives in your <span className="text-[#FF6B35] font-medium">inbox</span>, automating your social life so you don&apos;t have to. It lines up memorable experiences whether a virtual game night or a local hangout with a touch of wit and just enough <span className="text-[#FF6B35] font-medium">sarcasm</span> to feel human.
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
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Plans That <span className="text-[#FF6B35]">Stick</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Friday knows when it&apos;s been <span className="text-[#FF6B35] font-medium">too long</span> and jumps in with a full plan the place, the time, and the activity so friendships don&apos;t drift and every hangout is one you&apos;ll actually look forward to.</p>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#11d0be]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#11d0be]/20 transition-colors duration-300">
                <svg className="w-4 h-4 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Smart, <span className="text-[#FF6B35]">Memorable</span> Picks</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Not vague &ldquo;what works for you?&rdquo; back-and-forth Friday suggests <span className="text-[#FF6B35] font-medium">real experiences</span>: the bar you&apos;ve been meaning to try, a trail with the best fall colors, a board game night that turns into a tradition.</p>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#11d0be]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#11d0be]/20 transition-colors duration-300">
                <svg className="w-4 h-4 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 4.586l2.293-2.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Friendly <span className="text-[#FF6B35]">Persistence</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">When replies stall, Friday keeps the plan alive with <span className="text-[#FF6B35] font-medium">gentle nudges</span> until it becomes a memory worth keeping.</p>
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
            No more <span className="text-[#FF6B35] font-semibold">47-message group chats</span> about brunch Friday just makes it happen.
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