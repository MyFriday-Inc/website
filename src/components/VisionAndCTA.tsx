'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function VisionAndCTA() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const animationIdRef = useRef<number | undefined>(undefined)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)
    
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
      window.removeEventListener('scroll', handleScroll);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [])
  
  // Track mouse position for parallax effect (throttled)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || isScrolling) return
    
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    
    animationIdRef.current = requestAnimationFrame(() => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      const x = (clientX / innerWidth - 0.5) * 2
      const y = (clientY / innerHeight - 0.5) * 2
      
      setMousePosition({ x, y })
    });
  }

  return (
    <section id="vision-and-cta" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-white to-gray-50 relative" onMouseMove={handleMouseMove}>
      {/* Background effects */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/10 blur-3xl"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 rounded-full bg-[#FF6B35]/10 blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 rounded-full bg-purple-500/5 blur-3xl"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Vision Row - Center on mobile, left on desktop */}
          <motion.div 
            className="mb-12 flex justify-center sm:justify-start"
            style={reducedMotion ? {} : {
              translateX: mousePosition.x * 8,
              translateY: mousePosition.y * 4
            }}
          >
            <div className="max-w-3xl p-5 rounded-2xl bg-gradient-to-br from-[#11d0be]/10 via-transparent to-[#FF6B35]/10 hover:shadow-xl hover:shadow-[#11d0be]/10 transition-all duration-500"> {/* Center on mobile, left on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Vision Badge */}
                <motion.div 
                  className="mb-4 flex justify-center sm:justify-start"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30">
                    <motion.span 
                      className="w-2 h-2 bg-[#FF6B35] rounded-full mr-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      viewport={{ once: true }}
                    ></motion.span>
                    Our Vision
                  </span>
                </motion.div>
                
                {/* Vision Headline */}
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center sm:text-left"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  viewport={{ once: true }}
                >
                  Today is just the{' '}
                  <span className="bg-gradient-to-r from-[#0ef5dd] via-[#11d0be] to-[#1cabb8] bg-clip-text text-transparent">
                    start.
                  </span>
                </motion.h3>

                {/* Vision Content */}
                <motion.p 
                  className="text-base text-gray-600 leading-relaxed text-center sm:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  viewport={{ once: true }}
                >
                  <span className="text-[#FF6B35] font-medium">Friday</span> begins in email but that&apos;s only step one. Our vision is to make every part of your social life easier, lighter, and more fulfilling, so your days, weeks, and years feel richer than the ones before.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Founder's Note Row - Center on mobile, right on desktop */}
          <motion.div 
            className="mb-12 flex justify-center sm:justify-end"
            style={reducedMotion ? {} : {
              translateX: mousePosition.x * -8,
              translateY: mousePosition.y * -4
            }}
          >
            <div className="max-w-3xl p-5 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 via-transparent to-[#11d0be]/10 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-500"> {/* Center on mobile, right on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center sm:text-right"
              >
                {/* Founder Badge */}
                <motion.div 
                  className="mb-4 flex justify-center sm:justify-end"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30">
                    <motion.span 
                      className="w-2 h-2 bg-[#FF6B35] rounded-full mr-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      viewport={{ once: true }}
                    ></motion.span>
                    Founder&apos;s Note
                  </span>
                </motion.div>
                
                {/* Founder Headline */}
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center sm:text-right"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  viewport={{ once: true }}
                >
                  People should{' '}
                  <span className="bg-gradient-to-r from-[#0ef5dd] via-[#11d0be] to-[#1cabb8] bg-clip-text text-transparent">
                    meet up.
                  </span>
                </motion.h3>
                
                {/* Founder Content */}
                <motion.p 
                  className="text-base text-gray-600 leading-relaxed text-center sm:text-right"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  viewport={{ once: true }}
                >
                  &ldquo;We started <span className="text-[#FF6B35] font-medium">Friday</span> because loneliness is rising, even though we&apos;re more &ldquo;connected&rdquo; than ever. We don&apos;t need new people we need to strengthen the bonds we already have. But today, even staying in touch feels like a burden, with endless texts, busy calendars, and plans that never happen. <span className="text-[#FF6B35] font-medium">Friday</span> exists to change that, by making it simple to talk, to meet, and to share life together again.&rdquo;
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTAs - Side by side buttons */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center gap-6">
              {/* Primary CTA */}
              <motion.button
                className="px-6 py-3 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center text-sm shadow-lg shadow-[#11d0be]/25"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 35px rgba(17, 208, 190, 0.4)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                onClick={() => {
                  const signupSection = document.getElementById('signup-section')
                  if (signupSection) {
                    signupSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  Sign up now
                </motion.span>
                <motion.svg 
                  className="ml-1.5 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ x: -5, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </motion.button>
              
              {/* Secondary CTA */}
              <motion.button
                className="px-6 py-3 bg-transparent border border-[#11d0be] hover:bg-[#11d0be]/10 text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center text-sm hover:shadow-lg hover:shadow-[#11d0be]/15"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: "rgba(17, 208, 190, 0.8)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                onClick={() => {
                  const feedbackSection = document.getElementById('feedback-section')
                  if (feedbackSection) {
                    feedbackSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  Leave Feedback
                </motion.span>
                <motion.svg 
                  className="ml-1.5 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </motion.svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

