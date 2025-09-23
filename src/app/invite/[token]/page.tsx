'use client';

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'

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

interface Invitation {
  inviter_name: string
  inviter_city: string
  relationship_type: string
  expires_at: string
}

const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Dating',
  'Family',
  'Close Friends',
  'Friends',
  'Colleague',
  'Roommate',
  'Acquaintance',
  'Just Met'
]

export default function InvitePage() {
  const params = useParams()
  const token = params?.token as string
  
  // Invitation validation states
  const [isValidating, setIsValidating] = useState(true)
  const [isValidInvitation, setIsValidInvitation] = useState(false)
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  
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
  const [relationshipType, setRelationshipType] = useState('Friends')
  
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

  // Debounce and request cancellation refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const abortController = useRef<AbortController | null>(null)

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

  // Validate invitation token on load
  useEffect(() => {
    const validateInvitation = async () => {
      try {
        const result = await apiCall(`/invitation/${token}`)
        if (result.success && result.valid) {
          setIsValidInvitation(true)
          setInvitation(result.invitation)
        } else {
          setIsValidInvitation(false)
          setError(result.message || 'Invalid or expired invitation')
        }
    } catch {
      setIsValidInvitation(false)
      setError('Failed to validate invitation')
      } finally {
        setIsValidating(false)
      }
    }

    if (token) {
      validateInvitation()
    }
  }, [token])

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

  // Handle invitation redemption
  const handleRedeemInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.city_id) {
      setError('Please fill in all fields')
      return
    }

    setIsSigningUp(true)
    setError('')
    
    try {
      const result = await apiCall('/redeem-invitation', {
        method: 'POST',
        body: JSON.stringify({
          token,
          name: formData.name,
          email: formData.email,
          city_id: formData.city_id,
          relationship_type: relationshipType
        })
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
    } catch (error) {
      console.error('Add friend error:', error)
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
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  // Loading state
  if (isValidating) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#11d0be] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Validating invitation...</p>
          </div>
        </div>
      </>
    )
  }

  // Invalid invitation state
  if (!isValidInvitation) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Invitation</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-lg transition-all duration-300"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-black relative overflow-hidden">
        {/* Background effects */}
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
        
        <div className="relative z-10 container py-16 sm:py-20 lg:py-28 mt-20">
          <div className="max-w-md mx-auto">
            {/* Invitation Context */}
            {currentStep === 'signup' && invitation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="w-12 h-12 bg-[#11d0be] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">You&apos;re Invited!</h1>
                <p className="text-gray-300 mb-2">
                  <span className="text-[#11d0be] font-semibold">{invitation.inviter_name}</span> from{' '}
                  <span className="text-[#FF6B35]">{invitation.inviter_city}</span> has invited you to join Friday
                </p>
                <p className="text-sm text-gray-400">
                  First AI Social Life Assistant
                </p>
              </motion.div>
            )}

            {/* Form Container */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              
              {currentStep === 'signup' ? (
                /* Signup Form */
                <form onSubmit={handleRedeemInvitation} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Complete Your Signup</h3>
                    <p className="text-gray-400 mb-1">Join the Friday network</p>
                    <p className="text-sm text-gray-500">First AI Social Life Assistant</p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* City Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your City
                    </label>
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => handleCitySearch(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent"
                      placeholder="Search for your city"
                      required
                    />
                    
                    {/* Cities Dropdown */}
                    {showCities && cities.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {cities.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() => selectCity(city)}
                            className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                          >
                            {city.display}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {isSearching && (
                      <div className="absolute right-3 top-11 text-gray-400">
                        Searching...
                      </div>
                    )}
                  </div>

                  {/* Relationship Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Relationship to {invitation?.inviter_name}
                    </label>
                    <select
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent"
                      required
                    >
                      {RELATIONSHIP_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-gray-900 text-white">
                          {option}
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
                    disabled={isSigningUp || !formData.name || !formData.email || !formData.city_id}
                    className="w-full py-3 bg-[#11d0be] hover:bg-[#0fb8a8] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-300"
                  >
                    {isSigningUp ? 'Joining Friday...' : 'Join Friday'}
                  </button>
                </form>
              ) : (
                /* Success State with Add Friends */
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-[#11d0be] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome to Friday, {user?.name}!</h3>
                    
                    {/* Email Notification */}
                    <div className="bg-[#11d0be]/10 border border-[#11d0be]/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-300 text-center">
                        📧 <span className="font-medium text-white">Check your email!</span> You&apos;ll receive a welcome message from{' '}
                        <span className="text-[#11d0be] font-semibold">hello@myfriday.app</span> with important links.{' '}
                        <span className="font-medium text-white">Star this email</span> so you don&apos;t lose it - and check your spam folder if you don&apos;t see it!
                      </p>
                    </div>
                    
                    <p className="text-gray-400">You&apos;re now connected with {invitation?.inviter_name}</p>
                  </div>

                  {/* Add Friends Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Build Your Circle</h4>
                    <form onSubmit={handleAddFriend} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="email"
                          value={friendData.email}
                          onChange={(e) => setFriendData(prev => ({ ...prev, email: e.target.value }))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent text-sm"
                          placeholder="Friend's email"
                        />
                        <input
                          type="text"
                          value={friendData.name}
                          onChange={(e) => setFriendData(prev => ({ ...prev, name: e.target.value }))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent text-sm"
                          placeholder="Friend's name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2">
                          Relationship Type
                        </label>
                        <select
                          value={friendRelationshipType}
                          onChange={(e) => setFriendRelationshipType(e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent text-sm"
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
                        className="w-full py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 text-sm"
                      >
                        {isAddingFriend ? 'Adding...' : 'Invite People'}
                      </button>
                    </form>
                  </div>

                  {/* Added Friends List */}
                  {addedFriends.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Added Friends ({addedFriends.length})</h5>
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {addedFriends.map((friend, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>{friend.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Invitation Link */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Your Invitation Link</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={invitationUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                      <button
                        onClick={copyInvitationLink}
                        className="px-4 py-2 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-medium rounded-lg transition-all duration-300 text-sm"
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Share this link to build your circle
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Friday Section */}
        <div className="container py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Experience <span className="bg-gradient-to-r from-[#0d9488] to-[#11d0be] bg-clip-text text-transparent">Friday</span> in Email
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Friday lives in your <span className="text-[#FF6B35] font-medium">inbox</span>, automating your social life so you don&apos;t have to. It lines up memorable experiences whether a virtual game night or a local hangout with a touch of wit and just enough <span className="text-[#FF6B35] font-medium">sarcasm</span> to feel human.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#11d0be]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Plans That <span className="text-[#FF6B35]">Stick</span></h3>
                <p className="text-sm text-gray-300 leading-relaxed">Friday knows when it&apos;s been <span className="text-[#FF6B35] font-medium">too long</span> and jumps in with a full plan the place, the time, and the activity so friendships don&apos;t drift.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#11d0be]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Smart, <span className="text-[#FF6B35]">Memorable</span> Picks</h3>
                <p className="text-sm text-gray-300 leading-relaxed">Not vague &ldquo;what works for you?&rdquo; back-and-forth Friday suggests <span className="text-[#FF6B35] font-medium">real experiences</span>: the bar you&apos;ve been meaning to try, a trail with the best fall colors.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#11d0be]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#11d0be]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 4.586l2.293-2.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Friendly <span className="text-[#FF6B35]">Persistence</span></h3>
                <p className="text-sm text-gray-300 leading-relaxed">When replies stall, Friday keeps the plan alive with <span className="text-[#FF6B35] font-medium">gentle nudges</span> until it becomes a memory worth keeping.</p>
              </div>
            </div>

            {/* Final tagline */}
            <div className="text-center">
              <p className="text-xl text-gray-300 font-medium">
                No more <span className="text-[#FF6B35] font-semibold">47-message group chats</span> about brunch Friday just makes it happen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
