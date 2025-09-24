'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGeo } from '@/contexts/GeoContext'

interface GeoRestrictionBannerProps {
  onOpenModal: () => void
}

const BANNER_DISMISSED_KEY = 'friday_banner_dismissed'

export default function GeoRestrictionBanner({ onOpenModal }: GeoRestrictionBannerProps) {
  const { isUS, isLoading, country } = useGeo()
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY)
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true')
  }

  // Don't show banner if:
  // - Still loading
  // - User is in US
  // - Banner was dismissed
  if (isLoading || isUS || isDismissed) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-t border-white/10 text-white"
      >
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Message */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs sm:text-sm text-gray-300 leading-tight">
                <span className="text-white font-medium">Friday is currently US-only.</span>
                {country && (
                  <span className="hidden sm:inline ml-2">
                    Interested in bringing it to <span className="text-[#FF6B35] font-medium">{country}</span>?
                  </span>
                )}
              </div>
            </div>
            
            {/* Right side - Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenModal}
                className="bg-[#FF6B35] hover:bg-[#FF6B35]/80 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Join List
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
                aria-label="Dismiss"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
