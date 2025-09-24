'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGeo } from '@/contexts/GeoContext'

interface InternationalModalProps {
  isOpen: boolean
  onClose: () => void
}

const COUNTRIES = [
  'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Netherlands', 
  'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Austria', 'Belgium', 'Spain', 
  'Italy', 'Japan', 'South Korea', 'Singapore', 'New Zealand', 'Ireland', 'Other'
]

export default function InternationalModal({ isOpen, onClose }: InternationalModalProps) {
  const { country } = useGeo()
  const [email, setEmail] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(country || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !selectedCountry) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // API call to save international interest
      const response = await fetch('/api/international-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          country: selectedCountry,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form after delay
        setTimeout(() => {
          setEmail('')
          setSelectedCountry(country || '')
          setIsSubmitted(false)
          onClose()
        }, 2000)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('International waitlist submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('')
      setSelectedCountry(country || '')
      setError('')
      setIsSubmitted(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-md bg-gray-900 border border-white/20 rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6">
                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Friday isn&apos;t available in {country || 'your country'} yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        We&apos;re currently focused on perfecting the experience for our US users first. 
                        Join our international list to be notified when we expand!
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                          placeholder="Enter your email"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Country Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Country
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        >
                          <option value="" className="bg-gray-900">Select your country</option>
                          {COUNTRIES.map((countryName) => (
                            <option key={countryName} value={countryName} className="bg-gray-900">
                              {countryName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !email || !selectedCountry}
                        className="w-full py-2.5 bg-[#FF6B35] hover:bg-[#FF6B35]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        {isSubmitting ? 'Joining...' : 'Join International List'}
                      </button>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      You&apos;re on the list!
                    </h3>
                    <p className="text-gray-400 text-sm">
                      We&apos;ll notify you as soon as Friday becomes available in {selectedCountry}.
                      Thanks for your interest!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
