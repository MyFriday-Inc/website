'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)
  
  // Handle escape key press
  useEffect(() => {
    setIsVisible(isOpen)
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = '' // Restore scrolling when modal closes
    }
  }, [isOpen, onClose])
  
  // Handle clicking outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5 overflow-y-auto flex-grow">
              {children}
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-gray-800 flex justify-end sticky bottom-0 bg-gray-900">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
