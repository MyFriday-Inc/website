'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function FeedbackSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'feedback' as 'feedback' | 'comments' | 'call' | 'contribution' | 'partnership',
    message: ''
  })
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])
  
  // Track mouse position for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return
    
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    
    const x = (clientX / innerWidth - 0.5) * 2
    const y = (clientY / innerHeight - 0.5) * 2
    
    setMousePosition({ x, y })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          type: 'feedback',
          message: ''
        })
      } else {
        setError(result.error || 'Failed to send feedback')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset submitted state after 5 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  // Feedback type options
  const feedbackTypes = [
    { value: 'feedback', label: 'General Feedback' },
    { value: 'comments', label: 'Comments' },
    { value: 'call', label: 'Request a Call' },
    { value: 'contribution', label: 'Contribute to Vision' },
    { value: 'partnership', label: 'Partnership' }
  ]

  return (
    <section 
      id="feedback-section"
      className="bg-black relative overflow-hidden py-16 sm:py-20" 
      onMouseMove={handleMouseMove}
    >
      {/* Background effects - similar to Hero */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-[#11d0be]/5 blur-3xl"></div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#FF6B35]/10 to-transparent blur-3xl"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 items-center">
          
          {/* Left Content - Marketing */}
          <div className="space-y-4 sm:space-y-6 text-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="inline-block mx-auto"
            >
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30">
                <span className="w-1 h-1 bg-[#FF6B35] rounded-full mr-1"></span>
                We Want to Hear From You
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-white leading-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Help Shape{' '}
              <motion.span 
                className="bg-gradient-to-r from-[#0ef5dd] via-[#11d0be] to-[#1cabb8] bg-clip-text text-transparent"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Friday's Future
              </motion.span>
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              style={reducedMotion ? {} : {
                translateY: mousePosition.y * -5
              }}
            >
              Since we're very early, your feedback is incredibly valuable. Share your thoughts, request a call, contribute to our vision, or explore partnership opportunities.
            </motion.p>
            
          </div>

          {/* Right Content - Feedback Form */}
          <motion.div 
            className="flex justify-center w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            style={reducedMotion ? {} : {
              translateX: mousePosition.x * -10,
              translateY: mousePosition.y * -10
            }}
          >
            <div className="w-full max-w-3xl">
              {/* Form Container */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-6">
                
                {!submitted ? (
                  /* Feedback Form */
                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-4">
                    <div className="text-center mb-3">
                      <h3 className="text-xl font-bold text-white mb-1">Get in Touch</h3>
                      <p className="text-sm text-gray-400">We read every message personally</p>
                    </div>

                    {/* Name & Email Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2 sm:mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent text-sm"
                          placeholder="Enter your name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2 sm:mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent text-sm"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Feedback Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2 sm:mb-1">
                        What's this about?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {feedbackTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`flex items-center justify-center p-3 sm:p-2 rounded-lg border cursor-pointer transition-all duration-200 text-xs ${
                              formData.type === type.value
                                ? 'border-[#11d0be] bg-[#11d0be]/10'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <input
                              type="radio"
                              value={type.value}
                              checked={formData.type === type.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                              className="sr-only"
                            />
                            <span className="text-white font-medium">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2 sm:mb-1">
                        Your Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={5}
                        className="w-full px-3 py-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent resize-none text-sm"
                        placeholder="Tell us what's on your mind..."
                        required
                      />
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
                      disabled={isSubmitting}
                      className="w-full py-4 sm:py-2 bg-[#11d0be] hover:bg-[#0fb8a8] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all duration-300 text-sm"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                ) : (
                  /* Success State */
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-[#11d0be] rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-400">
                        Thanks for reaching out. We'll get back to you soon!
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
