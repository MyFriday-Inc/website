'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Animation effect for page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
    } ${
      isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Brand */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`relative flex items-center hover:opacity-80 transition-all duration-700 py-1 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
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
              className={`text-white hover:text-[#FF6B35] transition-all duration-700 text-sm font-medium ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isLoaded ? '200ms' : '0ms' }}
            >
              Home
            </button>
            <button 
              onClick={() => {
                const section = document.getElementById('vision-and-cta');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-white hover:text-[#FF6B35] transition-all duration-700 text-sm font-medium ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isLoaded ? '300ms' : '0ms' }}
            >
              About
            </button>
            <button 
              onClick={() => {
                const section = document.getElementById('feedback-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-white hover:text-[#FF6B35] transition-all duration-700 text-sm font-medium ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isLoaded ? '400ms' : '0ms' }}
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
            className={`hidden md:block bg-gradient-to-r from-[#0ea89a] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-semibold px-4 py-2 rounded-full transition-all duration-700 text-sm shadow-lg ${
              isLoaded ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-4'
            }`}
            style={{ transitionDelay: isLoaded ? '500ms' : '0ms' }}
          >
            Get Early Access
          </button>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-700 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{ transitionDelay: isLoaded ? '500ms' : '0ms' }}
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800/50 z-40 animate-in slide-in-from-top duration-300">
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