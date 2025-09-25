'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Lazy load Lottie component
const LottiePlayer = dynamic(() => import('./LottiePlayer'), {
  ssr: false
})

export default function Hero() {
  const [isVideoFallback] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)
  const [shouldLoadLottie, setShouldLoadLottie] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const animationIdRef = useRef<number | undefined>(undefined)

  
  // Check for reduced motion preference and low power mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Check if battery API is available to detect low power mode
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      // @ts-expect-error - getBattery might not be recognized by TypeScript
      navigator.getBattery().then((battery: { level: number, charging: boolean }) => {
        if (battery.level < 0.2 && !battery.charging) {
          setIsLowPowerMode(true);
        }
      }).catch(() => {
        setIsLowPowerMode(false);
      });
    }
    
    // Load Lottie after main text animations complete
    const lottieTimer = setTimeout(() => {
      setShouldLoadLottie(true);
    }, 800); // Load Lottie after main animations finish (~0.8s)
    
    // Disable parallax during scroll for performance
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      clearTimeout(lottieTimer);
      window.removeEventListener('scroll', handleScroll);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);
  
  // Track mouse position for parallax effect (throttled)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || isLowPowerMode || isScrolling || typeof window === 'undefined') return;
    
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    
    animationIdRef.current = requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
    });
  };

  // Animation variants for staggered text
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
      y: 30,
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


  return (
    <section 
      ref={heroRef}
      className="min-h-[75vh] md:min-h-screen bg-black relative overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <motion.div 
        className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/5 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      ></motion.div>
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#FF6B35]/10 to-transparent blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
      ></motion.div>
      
      {/* Grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Highlight circle for Lottie area */}
      <motion.div 
        className="absolute top-1/2 right-[10%] w-80 h-80 bg-[#11d0be]/10 rounded-full blur-2xl transform -translate-y-1/2 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      ></motion.div>
      
      {/* Highlight accent */}
      <motion.div 
        className="absolute top-1/2 right-[5%] w-10 h-10 bg-[#FF6B35]/15 rounded-full blur-lg transform -translate-y-1/2 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      ></motion.div>
      
      <div className="relative z-10 container min-h-[70vh] md:min-h-screen md:py-18 lg:py-24 pt-20 pb-16 md:pt-6 md:pb-0 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Content - Optimized Animations */}
          <motion.div 
            className="space-y-5 sm:space-y-6 md:max-w-lg text-center md:text-left md:pl-8 md:pt-6 py-6 md:py-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Brand Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-block md:mx-0 mx-auto"
            >
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mr-1.5"></span>
                Now in Beta
              </span>
            </motion.div>
            
            {/* Main Headline - Line by Line Animation */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
              variants={itemVariants}
            >
              <span className="block hero-text-line">World&apos;s</span>
              <span className="block hero-text-line bg-gradient-to-r from-[#0ef5dd] via-[#11d0be] to-[#1cabb8] bg-clip-text text-transparent">
                1st Social Life AI
              </span>
              <span className="block hero-text-line">Assistant</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0"
              variants={itemVariants}
            >
              Turning &ldquo;we should hang out&rdquo; into actual plans. Friday knows your circles, suggests the perfect spots, and makes sure you actually show up.
            </motion.p>
            
            {/* CTA Section */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center md:justify-start pt-2"
              variants={itemVariants}
            >
              {/* Primary CTA */}
              <motion.button
                className="px-8 py-4 sm:px-5 sm:py-2.5 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center text-base sm:text-sm cursor-pointer w-full sm:w-auto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const section = document.getElementById('signup-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Early Access
                <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
              
              {/* Secondary CTA */}
              <motion.button
                className="px-8 py-4 sm:px-5 sm:py-2.5 bg-transparent border border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300 flex items-center justify-center text-base sm:text-sm cursor-pointer w-full sm:w-auto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const section = document.getElementById('how-it-works');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See how it works
              </motion.button>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div
              className="justify-center md:justify-start mt-6 md:mt-4"
              variants={itemVariants}
            >
              <p className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#FF6B35]/5 to-transparent rounded-lg border-l-2 border-[#FF6B35]/30">
                <span className="text-[#FF6B35] font-semibold tracking-wide text-sm">Be the pioneer that shapes Friday&apos;s future</span>
              </p>
            </motion.div>

            {/* Product Hunt Badge */}
            <motion.div
              className="flex items-center justify-center md:justify-start mt-6 gap-3"
              variants={itemVariants}
            >
              <p className="text-gray-400 text-sm">Featured on</p>
              <a 
                href="https://www.producthunt.com/products/friday-7?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-friday&#0045;7" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:scale-105 transition-transform duration-200"
              >
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1019809&theme=dark&t=1758775155601" 
                  alt="Friday - World's 1st Social Life AI Assistant | Product Hunt" 
                  style={{width: '160px', height: '35px'}} 
                  width="160" 
                  height="35"
                  className="max-w-full h-auto"
                />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Progressive Lottie Animation */}
          <motion.div 
            className="hidden md:flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={reducedMotion || isLowPowerMode ? {} : {
              translateX: mousePosition.x * -15,
              translateY: mousePosition.y * -15
            }}
          >
            <div className="relative w-full max-w-2xl sm:max-w-3xl">
              <div className="relative z-10">
                {shouldLoadLottie && !isVideoFallback ? (
                  <LottiePlayer />
                ) : isVideoFallback ? (
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
                ) : null}
              </div>
              
            </div>
          </motion.div>
          
        </div>
      </div>

      <style jsx>{`
        .hero-text-line {
          animation: slideUpFade 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        .hero-text-line:nth-child(1) {
          animation-delay: 0.2s;
        }
        
        .hero-text-line:nth-child(2) {
          animation-delay: 0.4s;
        }
        
        .hero-text-line:nth-child(3) {
          animation-delay: 0.6s;
        }
        
        @keyframes slideUpFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}