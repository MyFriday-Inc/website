'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Separate effect for closing mobile menu on scroll
  useEffect(() => {
    if (typeof window === 'undefined' || !mobileMenuOpen) return;
    
    const handleScrollClose = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener('scroll', handleScrollClose);
    return () => {
      window.removeEventListener('scroll', handleScrollClose);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('header')) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      scrolled ? 'bg-black border-gray-800/50' : 'border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Brand */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative flex items-center hover:opacity-80 transition-opacity py-1"
          >
            <div className="relative w-16 sm:w-20 h-12 sm:h-16 overflow-hidden" style={{ marginTop: '-5px', marginBottom: '-5px' }}>
              <Image
                src="/images/logo.gif"
                alt="Friday Logo"
                width={100}
                height={100}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-16 sm:h-20 object-contain"
                unoptimized={true}
                priority
              />
            </div>
            <span className="text-white text-xl sm:text-2xl font-bold ml-[-8px] sm:ml-[-10px]">Friday</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white hover:text-[#FF6B35] transition-colors text-sm font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => {
                const section = document.getElementById('vision-and-cta');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white hover:text-[#FF6B35] transition-colors text-sm font-medium"
            >
              About
            </button>
            <button 
              onClick={() => {
                const section = document.getElementById('feedback-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white hover:text-[#FF6B35] transition-colors text-sm font-medium"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button */}
          <button 
            onClick={() => {
              const section = document.getElementById('signup-section');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden md:block bg-gradient-to-r from-[#0ea89a] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 text-sm shadow-lg"
          >
            Get Early Access
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800/50 z-40">
          <div className="px-4 py-6 space-y-4">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white hover:text-[#FF6B35] transition-colors text-lg font-medium py-2"
            >
              Home
            </button>
            <button 
              onClick={() => {
                const section = document.getElementById('vision-and-cta');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white hover:text-[#FF6B35] transition-colors text-lg font-medium py-2"
            >
              About
            </button>
            <button 
              onClick={() => {
                const section = document.getElementById('feedback-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-white hover:text-[#FF6B35] transition-colors text-lg font-medium py-2"
            >
              Contact
            </button>
            <div className="pt-4 border-t border-gray-800/50">
              <button 
                onClick={() => {
                  const section = document.getElementById('signup-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-[#0ea89a] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 text-sm shadow-lg"
              >
                Get Early Access
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 