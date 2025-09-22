'use client'

import { useState, useRef, useEffect } from 'react'
import Lottie from 'lottie-react'
import heroAnimation from '../../public/images/Hero.json'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll'

export default function Hero() {
  const [isVideoFallback, setIsVideoFallback] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)

  const handleLottieError = () => {
    setIsVideoFallback(true)
  }
  
  // Check for reduced motion preference and low power mode
  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    // Function to handle changes to the media query
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Check if battery API is available to detect low power mode
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      // @ts-expect-error - getBattery might not be recognized by TypeScript
      navigator.getBattery().then((battery: { level: number, charging: boolean }) => {
        // If battery level is low, consider it low power mode
        if (battery.level < 0.2 && !battery.charging) {
          setIsLowPowerMode(true);
        }
      }).catch(() => {
        // If battery API fails, fallback to normal mode
        setIsLowPowerMode(false);
      });
    }
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  // Track mouse position for parallax effect - only if not in reduced motion mode
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || isLowPowerMode || typeof window === 'undefined') return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate position as percentage from center
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    
    setMousePosition({ x, y });
  };

  return (
    <section 
      className="min-h-[75vh] md:min-h-screen bg-black relative overflow-hidden" 
      onMouseMove={handleMouseMove}>
      {/* No noise texture */}
      
      {/* Bottom right accent glow */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/5 blur-3xl"></div>
      
      {/* Light orange gradient - top left */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#FF6B35]/10 to-transparent blur-3xl"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[70vh] md:min-h-screen md:py-18 lg:py-24 pt-20 pb-16 md:pt-6 md:pb-0 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Content - More Compact & Elegant */}
          <div className="space-y-5 sm:space-y-6 md:max-w-lg text-center md:text-left md:pl-8 md:pt-6 py-6 md:py-0">
            
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block md:mx-0 mx-auto"
            >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mr-1.5"></span>
                Now in Beta
              </span>
            </motion.div>
            
            {/* Main Headline - Letter by Letter Animation */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {"World's ".split("").map((char, index) => (
                <motion.span
                  key={`first-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.05 * index,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <span className="inline-block">
                {"1st Social Life AI".split("").map((char, index) => (
                  <motion.span
                    key={`second-${index}`}
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: 0.6 + (0.04 * index),
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className={char === " " ? "" : "bg-gradient-to-r from-[#0ef5dd] via-[#11d0be] to-[#1cabb8] bg-clip-text text-transparent"}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>{' '}
              {"Assistant".split("").map((char, index) => (
                <motion.span 
                  key={`third-${index}`}
                  className="md:inline"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 1.2 + (0.05 * index),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheading - Words Animation */}
            <div className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-md sm:max-w-sm mx-auto md:mx-0 overflow-hidden">
              {["Our", "first", "step", "in", "a", "big", "vision,", "Friday", "lives", "in", "email", "today.", "Get", "early", "access."].map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-1.5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 1.8 + (0.08 * index),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            
            {/* CTA Section - Staggered Animation */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center md:justify-start pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Primary CTA */}
              <ScrollLink to="signup-section" smooth={true} duration={800} offset={-50}>
                <motion.button
                  className="px-8 py-4 sm:px-5 sm:py-2.5 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center text-base sm:text-sm cursor-pointer w-full sm:w-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Early Access
                  <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </ScrollLink>
              
              {/* Secondary CTA */}
              <ScrollLink to="how-it-works" smooth={true} duration={600} offset={-70}>
                <motion.button
                  className="px-8 py-4 sm:px-5 sm:py-2.5 bg-transparent border border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300 flex items-center justify-center text-base sm:text-sm cursor-pointer w-full sm:w-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  See how it works
                </motion.button>
              </ScrollLink>
            </motion.div>
            
            {/* Social Proof - Slide Up Animation */}
            <motion.div
              className="justify-center md:justify-start mt-6 md:mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#FF6B35]/5 to-transparent rounded-lg border-l-2 border-[#FF6B35]/30">
                <span className="text-[#FF6B35] font-semibold tracking-wide text-sm">Be the pioneer that shapes Friday&apos;s future</span>
              </p>
            </motion.div>
          </div>

          {/* Right Content - Lottie Animation */}
          <motion.div 
            className="hidden md:flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={reducedMotion || isLowPowerMode ? {} : {
              translateX: mousePosition.x * -15,
              translateY: mousePosition.y * -15
            }}
          >
            <div className="relative w-full max-w-lg sm:max-w-xl">
              {/* Highlight circle */}
              <div className="absolute -inset-4 bg-[#11d0be]/10 rounded-full blur-2xl -z-10"></div>
              
              {/* No animated overlay lines */}
              
              {/* No border or box container */}
              <div className="relative z-10">
                {!isVideoFallback ? (
                  <Lottie
                    animationData={heroAnimation}
                    loop={true}
                    autoplay={true}
                    onError={handleLottieError}
                    className="w-[120%] h-auto transform scale-110 -ml-[10%]"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto rounded-lg"
                  >
                    <source src="/images/Hero Video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {/* No tech dots overlay */}
              </div>
              
              {/* Highlight accent - orange */}
              <div className="absolute top-1/2 -right-4 w-10 h-10 bg-[#FF6B35]/15 rounded-full blur-lg"></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}