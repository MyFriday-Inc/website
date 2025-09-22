'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
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

  // Scroll to specific sections using IDs
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  // Scroll to signup section
  const scrollToSignup = () => scrollToSection("signup-section")
  
  // Scroll to hero section
  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Scroll to how it works section
  const scrollToHowItWorks = () => scrollToSection("how-it-works")
  
  // Scroll to vision section
  const scrollToVision = () => scrollToSection("vision-and-cta")
  
  // Scroll to feedback section
  const scrollToFeedback = () => scrollToSection("feedback-section")

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer 
      className="bg-black relative overflow-hidden border-t border-white/10"
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#FF6B35]/5 to-transparent blur-3xl"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative z-10 container">
        
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
            
            {/* Logo & Description */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={reducedMotion ? {} : {
                translateY: mousePosition.y * -3
              }}
            >
              {/* Logo */}
              <div className="flex items-center justify-center space-x-3">
                <div className="relative w-16 h-16">
                  <Image
                    src="/images/logo1.png"
                    alt="Friday Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <span className="text-3xl font-bold text-white">Friday</span>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                World&apos;s first Social Life AI Assistant. Making real connections easier.
              </p>
            </motion.div>
            
            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={scrollToSignup}
                className="px-8 py-4 sm:px-6 sm:py-3 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center text-base sm:text-sm shadow-lg shadow-[#11d0be]/25"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 35px rgba(17, 208, 190, 0.4)", y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <svg className="ml-2 w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
              
              <motion.button
                onClick={scrollToFeedback}
                className="px-8 py-4 sm:px-6 sm:py-3 bg-transparent border border-[#11d0be] hover:bg-[#11d0be]/10 text-[#11d0be] font-bold rounded-full transition-all duration-300 flex items-center justify-center text-base sm:text-sm hover:shadow-lg hover:shadow-[#11d0be]/15"
                whileHover={{ scale: 1.05, borderColor: "rgba(17, 208, 190, 0.8)", y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
                <svg className="ml-2 w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.button 
                onClick={scrollToHero}
                className="text-gray-300 hover:text-[#11d0be] transition-colors duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
              <motion.button 
                onClick={scrollToHowItWorks}
                className="text-gray-300 hover:text-[#11d0be] transition-colors duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                How It Works
              </motion.button>
              <motion.button 
                onClick={scrollToVision}
                className="text-gray-300 hover:text-[#11d0be] transition-colors duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Vision
              </motion.button>
              <motion.button 
                onClick={scrollToFeedback}
                className="text-gray-300 hover:text-[#11d0be] transition-colors duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Feedback
              </motion.button>
              <motion.button 
                onClick={scrollToSignup}
                className="text-gray-300 hover:text-[#11d0be] transition-colors duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Signup
              </motion.button>
              <motion.button 
                onClick={scrollToTop}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Top ↑
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex items-center justify-center space-x-4 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="https://www.instagram.com/myfriday.app?igsh=MW5qdnp5aTJvbjJsOA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 sm:w-12 sm:h-12 bg-white/10 hover:bg-[#E4405F] rounded-lg flex items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/company/myfridayap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 sm:w-12 sm:h-12 bg-white/10 hover:bg-[#0077B5] rounded-lg flex items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
              
              <motion.a
                href="mailto:app.myfriday@gmail.com"
                className="w-14 h-14 sm:w-12 sm:h-12 bg-white/10 hover:bg-[#EA4335] rounded-lg flex items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636C.732 21.002 0 20.27 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v.273L12 8.917l6.545-4.823v-.273h3.819C23.268 3.821 24 4.553 24 5.457z"/>
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          className="border-t border-white/10 py-8 sm:py-6 flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2025 MyFriday, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 sm:space-x-4 text-sm sm:text-xs">
              <Link href="/privacy" className="text-gray-400 hover:text-[#11d0be] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#11d0be] transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Built with</span>
            <span className="text-red-400">♥</span>
            <span>for real connections</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
