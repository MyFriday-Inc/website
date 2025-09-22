'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/components/Modal'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

interface City {
  id: number
  city: string
  state: string
  timezone: string
  display: string
}

interface User {
  id: string
  name: string
  email: string
  location_city: string
  location_state: string
  location_timezone: string
}

interface Friend {
  id: string
  name: string
  email: string
  location_city: string
  location_state: string
  location_timezone: string
}

const RELATIONSHIP_OPTIONS = [
  'Mom',
  'Dad', 
  'Family',
  'Spouse',
  'Close Friends',
  'Friends',
  'Acquaintance',
  'Just Met',
  'Partner'
]

export default function SignupSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const animationIdRef = useRef<number | undefined>(undefined)
  
  // Viewport detection for animations
  const { ref: sectionRef, isInView } = useInView({
    threshold: 0.1,
    rootMargin: '100px 0px'
  })
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city_id: null as number | null
  })
  const [citySearch, setCitySearch] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showCities, setShowCities] = useState(false)
  
  // Flow states
  const [currentStep, setCurrentStep] = useState<'signup' | 'success'>('signup')
  const [user, setUser] = useState<User | null>(null)
  const [invitationUrl, setInvitationUrl] = useState('')
  
  // Friend adding states
  const [friendData, setFriendData] = useState({
    email: '',
    name: ''
  })
  const [friendRelationshipType, setFriendRelationshipType] = useState('Friends')
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const [addedFriends, setAddedFriends] = useState<Friend[]>([])
  
  // Loading and error states
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  
  // Terms and privacy policy states
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Debounce and request cancellation refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const abortController = useRef<AbortController | null>(null)

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

  // Cleanup timers and abort controllers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      if (abortController.current) {
        abortController.current.abort()
      }
    }
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

  // API call helper
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT}.supabase.co/functions/v1`
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY!,
        ...options.headers
      }
    })
    return response.json()
  }

  // Search cities with abort controller
  const searchCities = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setCities([])
      setShowCities(false)
      return
    }
    
    // Cancel previous request if it exists
    if (abortController.current) {
      abortController.current.abort()
    }
    
    // Create new abort controller for this request
    abortController.current = new AbortController()
    
    setIsSearching(true)
    try {
      const baseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT}.supabase.co/functions/v1`
      const response = await fetch(`${baseUrl}/cities?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY!,
        },
        signal: abortController.current.signal
      })
      
      const result = await response.json()
      if (result.success) {
        setCities(result.cities)
        setShowCities(true)
      }
    } catch (error) {
      // Don't show error for aborted requests
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('City search error:', error)
      }
    } finally {
      setIsSearching(false)
    }
  }

  // Handle city search input with debouncing
  const handleCitySearch = (value: string) => {
    setCitySearch(value)
    setSelectedCity(null)
    setFormData(prev => ({ ...prev, city_id: null }))
    
    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      searchCities(value)
    }, 400) // 400ms delay
  }

  // Select city
  const selectCity = (city: City) => {
    setSelectedCity(city)
    setCitySearch(city.display)
    setFormData(prev => ({ ...prev, city_id: city.id }))
    setShowCities(false)
  }

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.city_id) {
      setError('Please fill in all fields')
      return
    }
    
    if (!acceptedTerms) {
      setError('You must accept the Terms & Conditions and Privacy Policy')
      return
    }

    setIsSigningUp(true)
    setError('')
    
    try {
      const result = await apiCall('/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      
      if (result.success) {
        setUser(result.user)
        setInvitationUrl(result.invitation.invitation_url)
        setCurrentStep('success')
      } else {
        setError(result.message || 'Signup failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  // Add friend
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!friendData.email || !friendData.name || !user) return

    setIsAddingFriend(true)
    try {
      const result = await apiCall('/add-friend', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          friend_email: friendData.email,
          friend_name: friendData.name,
          friend_city_id: selectedCity?.id || formData.city_id,
          relationship_type: friendRelationshipType
        })
      })
      
      if (result.success && result.friend) {
        setAddedFriends(prev => [...prev, result.friend])
        setFriendData({ email: '', name: '' })
      }
    } catch (err) {
      console.error('Add friend error:', err)
    } finally {
      setIsAddingFriend(false)
    }
  }

  // Copy invitation link
  const copyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <section 
      ref={sectionRef}
      id="signup-section"
      className="min-h-[80vh] md:min-h-screen bg-black relative overflow-hidden" 
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
      
      <div className="relative z-10 container py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
          
          {/* More Compact & Elegant Headline */}
          <div className="overflow-hidden mb-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-center">
              {/* First word animation */}
              <motion.span
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{
                  duration: 0.5,
                  delay: 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                Experience
              </motion.span>
              
              {/* Friday with gradient and special animation */}
              <motion.span
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F35] bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Friday
              </motion.span>
              
              {/* Final part with animation */}
              <motion.span
                className="inline-block sm:block sm:mt-0.5 bg-gradient-to-r from-[#0ef5dd] via-[#11d0be] to-[#1cabb8] bg-clip-text text-transparent ml-1 sm:ml-0"
                initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
                animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(8px)", y: 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                Before Everyone Else
              </motion.span>
            </h2>
          </div>

          {/* Updated Subheading */}
          <motion.p 
            className="text-sm md:text-base text-gray-300 leading-relaxed max-w-lg text-center mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{
              duration: 0.5,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            Join the early waitlist to start using <span className="text-[#FF6B35] font-medium">Friday</span> for free to see the change in how you spend your free time.
          </motion.p>
          
          {/* Centered Signup Form - More Compact */}
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            style={reducedMotion ? {} : {
              translateY: mousePosition.y * -5
            }}
          >
            <div className="w-full max-w-md">
              {/* Form Container */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 sm:p-6">
                
                {currentStep === 'signup' ? (
                  /* Signup Form */
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="text-center mb-4">
                      <motion.h3 
                        className="text-xl font-bold text-white mb-1.5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 2.0 }}
                      >
                        Join Friday
                      </motion.h3>
                      <motion.p 
                        className="text-gray-400 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2.1 }}
                      >
                        Early access waitlist
                      </motion.p>
                    </div>

                    {/* Name Input */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 2.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <motion.input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#11d0be] focus:border-transparent transition-all duration-200 hover:bg-white/15 text-sm"
                        placeholder="Enter your full name"
                        required
                        whileFocus={{ scale: 1.01, borderColor: "rgba(17, 208, 190, 0.5)" }}
                      />
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 2.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <motion.input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#11d0be] focus:border-transparent transition-all duration-200 hover:bg-white/15 text-sm"
                        placeholder="Enter your email"
                        required
                        whileFocus={{ scale: 1.01, borderColor: "rgba(17, 208, 190, 0.5)" }}
                      />
                    </motion.div>

                    {/* City Search */}
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 2.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your City
                      </label>
                      <motion.input
                        type="text"
                        value={citySearch}
                        onChange={(e) => handleCitySearch(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#11d0be] focus:border-transparent transition-all duration-200 hover:bg-white/15 text-sm"
                        placeholder="Search for your city"
                        required
                        whileFocus={{ scale: 1.01, borderColor: "rgba(17, 208, 190, 0.5)" }}
                      />
                      
                      {/* Cities Dropdown */}
                      {showCities && cities.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {cities.map((city, idx) => (
                            <motion.button
                              key={city.id}
                              type="button"
                              onClick={() => selectCity(city)}
                              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: 0.05 * idx }}
                              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                            >
                              {city.display}
                            </motion.button>
                          ))}
                        </div>
                      )}
                      
                      {isSearching && (
                        <div className="absolute right-3 top-11 text-gray-400">
                          Searching...
                        </div>
                      )}
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Terms Checkbox */}
                    <motion.div 
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 2.5 }}
                    >
                      <div className="flex h-5 items-center">
                        <motion.input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="h-4 w-4 rounded border-white/20 bg-white/10 text-[#11d0be] focus:ring-[#11d0be] focus:ring-opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      </div>
                      <div className="ml-2 text-xs">
                        <label htmlFor="terms" className="text-gray-300">
                          I accept the{' '}
                          <button 
                            type="button" 
                            onClick={() => setShowTermsModal(true)} 
                            className="text-[#11d0be] hover:underline focus:outline-none"
                          >
                            Terms & Conditions
                          </button>{' '}
                          and{' '}
                          <button 
                            type="button" 
                            onClick={() => setShowPrivacyModal(true)}
                            className="text-[#11d0be] hover:underline focus:outline-none"
                          >
                            Privacy Policy
                          </button>
                        </label>
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 2.6 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={isSigningUp || !formData.name || !formData.email || !formData.city_id}
                        className="w-full py-2.5 bg-[#11d0be] hover:bg-[#0fb8a8] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-full transition-all duration-300 text-sm shadow-sm"
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(17, 208, 190, 0.3)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isSigningUp ? 'Processing...' : 'Join Waitlist'}
                      </motion.button>
                    </motion.div>
                  </form>
                ) : (
                  /* Success State with Add Friends */
                  <div className="space-y-5">
                    <div className="text-center mb-5">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-[#11d0be] to-[#0eaeb0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#11d0be]/15"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.1 
                        }}
                      >
                        <svg 
                          className="w-6 h-6 text-black" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <motion.path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </svg>
                      </motion.div>
                      <motion.h3 
                        className="text-2xl font-bold text-white mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Welcome, {user?.name}!
                      </motion.h3>
                      <motion.p 
                        className="text-sm text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        You&apos;re on the waitlist
                      </motion.p>
                      <motion.p 
                        className="text-xs text-gray-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        We&apos;ll notify you when your access is ready
                      </motion.p>
                    </div>

                    {/* Add Friends Section */}
                    <div>
                      <h4 className="text-base font-medium text-white mb-3">Build Your Circle</h4>
                      <form onSubmit={handleAddFriend} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="email"
                            value={friendData.email}
                            onChange={(e) => setFriendData(prev => ({ ...prev, email: e.target.value }))}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#11d0be] focus:border-transparent text-xs"
                            placeholder="Friend's email"
                          />
                          <input
                            type="text"
                            value={friendData.name}
                            onChange={(e) => setFriendData(prev => ({ ...prev, name: e.target.value }))}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#11d0be] focus:border-transparent text-xs"
                            placeholder="Friend's name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">
                            Relationship Type
                          </label>
                          <select
                            value={friendRelationshipType}
                            onChange={(e) => setFriendRelationshipType(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#11d0be] focus:border-transparent text-xs"
                            required
                          >
                            {RELATIONSHIP_OPTIONS.map((option) => (
                              <option key={option} value={option} className="bg-gray-900 text-white">
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          disabled={isAddingFriend || !friendData.email || !friendData.name}
                          className="w-full py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-full transition-all duration-300 text-xs"
                        >
                          {isAddingFriend ? 'Adding...' : 'Invite People'}
                        </button>
                      </form>
                    </div>

                    {/* Added Friends List */}
                    {addedFriends.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-300 mb-1.5">Added Friends ({addedFriends.length})</h5>
                        <div className="space-y-1.5 max-h-20 overflow-y-auto">
                          {addedFriends.map((friend, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <span>{friend.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Invitation Link */}
                    <div>
                      <h4 className="text-base font-medium text-white mb-2">Share Invitation</h4>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={invitationUrl}
                          readOnly
                          className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs"
                        />
                        <button
                          onClick={copyInvitationLink}
                          className="px-3 py-1.5 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-medium rounded-full transition-all duration-300 text-xs shadow-sm"
                        >
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        Share this link to build your circle
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Terms Modal */}
      <Modal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        title="Terms & Conditions"
      >
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-bold mb-3 text-[#11d0be]">1. Introduction</h2>
            <p className="mb-3">
              Welcome to Friday! These Terms and Conditions govern your use of the Friday application and services 
              operated by MyFriday, Inc.
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of 
              the Terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#11d0be]">2. Use of the Service</h2>
            <p className="mb-3">
              Friday is an AI-powered social life assistant designed to help you maintain and enhance your social connections.
            </p>
            <p className="mb-3">
              You may use our Service only for lawful purposes and in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#11d0be]">3. Privacy</h2>
            <p className="mb-3">
              Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.
            </p>
          </section>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              For the complete Terms & Conditions, please visit our{' '}
              <Link href="/terms" className="text-[#11d0be] hover:underline">
                full Terms & Conditions page
              </Link>.
            </p>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
        title="Privacy Policy"
      >
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-bold mb-3 text-[#11d0be]">1. Introduction</h2>
            <p className="mb-3">
              MyFriday, Inc. operates the Friday application and services. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.
            </p>
            <p>
              We value your privacy and are committed to protecting your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#11d0be]">2. Information Collection</h2>
            <p className="mb-3">
              To provide and improve our Service, we collect several different types of information including your name, email address, location data, social connections, calendar information, and communication preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#11d0be]">3. How We Use Your Information</h2>
            <p className="mb-3">
              We use the collected information to provide and maintain our Service, personalize your experience, improve our Service, communicate with you, and detect and address technical issues.
            </p>
          </section>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              For the complete Privacy Policy, please visit our{' '}
              <Link href="/privacy" className="text-[#11d0be] hover:underline">
                full Privacy Policy page
              </Link>.
            </p>
          </div>
        </div>
      </Modal>
    </section>
  )
}
