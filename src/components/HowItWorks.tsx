'use client';

import React from 'react';
import { motion } from 'framer-motion';
import EmailDemo from './demo/EmailDemo';
import { Link as ScrollLink } from 'react-scroll';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-8 sm:py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/10 blur-3xl"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 rounded-full bg-[#FF6B35]/10 blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 rounded-full bg-purple-500/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8 md:mb-6">
          <div className="overflow-hidden mb-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
              {"Experience Friday In Email".split(" ").map((word, index) => (
                <motion.span
                  key={`title-${index}`}
                  className="inline-block mr-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 * index,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>
          <div className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              Friday meets you where you are at starting with <motion.span 
                className="text-[#FF6B35] font-medium"
                initial={{ color: "#6b7280" }}
                animate={{ color: "#FF6B35" }}
                transition={{ duration: 1, delay: 0.9 }}
              >Email</motion.span>. 
              Take a step closer to <motion.span 
                className="text-[#FF6B35] font-medium"
                initial={{ color: "#6b7280" }}
                animate={{ color: "#FF6B35" }}
                transition={{ duration: 1, delay: 1.2 }}
              >automating your social life</motion.span>.
            </motion.p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Left side - Features */}
          <div className="space-y-4 sm:space-y-5 order-2 md:order-1">
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#11d0be]/20 flex items-center justify-center text-[#11d0be] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Never Miss a <span className="text-[#FF6B35]">Connection</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Friday notices when you&apos;re overdue for a catchup and reaches out with perfect timing and charm.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#11d0be]/20 flex items-center justify-center text-[#11d0be] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Delightful <span className="text-[#FF6B35]">Planning Magic</span></h3>
                <p className="text-sm text-gray-600 leading-relaxed">Suggests meetups that feel just right—your favorite spots, perfect timing, zero hassle.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start group hover:bg-gray-50/50 p-3 rounded-lg transition-colors duration-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#11d0be]/20 flex items-center justify-center text-[#11d0be] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-0.5">Witty <span className="text-[#FF6B35]">Follow-ups</span> That Work</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Charming nudges for non-responders and clever conflict resolution that gets everyone together.</p>
              </div>
            </motion.div>
            
          </div>
          
          {/* Right side - Demo */}
          <motion.div
            className="relative z-10 order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-[#11d0be]/10 via-transparent to-[#FF6B35]/10 p-3 sm:p-4 md:p-5 rounded-2xl transform scale-90 sm:scale-95 md:scale-100 mx-auto max-w-sm sm:max-w-md md:max-w-none">
              <EmailDemo />
            </div>
          </motion.div>
        </div>
        
        {/* CTA Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrollLink to="signup-section" smooth={true} duration={800} offset={-50}>
            <motion.button 
              className="bg-gradient-to-r from-[#11d0be] to-[#0fbfaf] hover:from-[#0fbfaf] hover:to-[#0ea89a] text-black font-semibold py-2.5 px-7 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm border border-[#11d0be]/20 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(17, 208, 190, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Early Access
            </motion.button>
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  );
}