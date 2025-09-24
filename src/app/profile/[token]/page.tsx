'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { US_STATES } from '@/utils/states'

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
  profile_updated_at: string
}

interface CircleConnection {
  id: string
  name: string
  relationship_type: string
  user_a_id: string
  user_b_id: string
}

interface InvitationStats {
  link: string
  usage_count: number
}

const RELATIONSHIP_OPTIONS = [
  'friend',
  'family',
  'colleague',
  'acquaintance',
  'partner'
]

export default function ProfilePage() {
  const params = useParams()
  const token = params?.token as string
  
  // Profile states
  const [isLoading, setIsLoading] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    city_id: null as number | null,
    city: '',
    state: ''
  })
  const [citySearch, setCitySearch] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showCities, setShowCities] = useState(false)
  const [useManualLocation, setUseManualLocation] = useState(false)
  
  // UI states
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Circle and invitation states
  const [circle, setCircle] = useState<CircleConnection[]>([])
  const [invitationStats, setInvitationStats] = useState<InvitationStats | null>(null)
  const [isLoadingCircle, setIsLoadingCircle] = useState(false)
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false)
  const [isUpdatingRelationship, setIsUpdatingRelationship] = useState<string | null>(null)

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
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        ...options.headers
      }
    })
    return response.json()
  }

  // Load circle data
  const loadCircleData = useCallback(async () => {
    setIsLoadingCircle(true)
    try {
      const result = await apiCall(`/user-profile/${token}/circle`)
      if (result.success) {
        setCircle(result.circle)
      } else {
        console.error('Failed to load circle:', result.message)
      }
    } catch {
      console.error('Error loading circle')
    } finally {
      setIsLoadingCircle(false)
    }
  }, [token])

  // Load invitation stats
  const loadInvitationStats = useCallback(async () => {
    setIsLoadingInvitation(true)
    try {
      const result = await apiCall(`/user-profile/${token}/invitation`)
      if (result.success) {
        setInvitationStats(result.invitation)
      } else {
        console.error('Failed to load invitation stats:', result.message)
      }
    } catch {
      console.error('Error loading invitation stats')
    } finally {
      setIsLoadingInvitation(false)
    }
  }, [token])

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await apiCall(`/profile/${token}`)
        
        if (result.success) {
          setIsValidToken(true)
          setUser(result.user)
          setFormData({
            name: result.user.name,
            city_id: null, // We'll need to find the city_id if they want to change location
            city: result.user.location_city,
            state: result.user.location_state
          })
          setCitySearch(`${result.user.location_city}, ${result.user.location_state}`)
        } else {
          setIsValidToken(false)
          setError(result.message || 'Invalid profile token')
        }
      } catch {
        setIsValidToken(false)
        setError('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      loadProfile()
    }
  }, [token])

  // Load circle and invitation data when user is valid and loaded
  useEffect(() => {
    if (isValidToken && user) {
      loadCircleData()
      loadInvitationStats()
    }
  }, [isValidToken, user, loadCircleData, loadInvitationStats])

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
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        signal: abortController.current.signal
      })
      
      const result = await response.json()
      if (result.success) {
        setCities(result.cities)
        setShowCities(result.cities.length > 0)
        
        // If no cities found and user has typed enough, enable manual mode
        if (result.cities.length === 0 && searchTerm.length >= 3) {
          setUseManualLocation(true)
        }
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
    setFormData(prev => ({ ...prev, city_id: null, city: value }))
    setUseManualLocation(false)
    
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
    setFormData(prev => ({ 
      ...prev, 
      city_id: city.id, 
      city: city.city,
      state: city.state 
    }))
    setShowCities(false)
    setUseManualLocation(false)
  }

  // Start editing
  const startEditing = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false)
    if (user) {
      setFormData({
        name: user.name,
        city_id: null,
        city: user.location_city,
        state: user.location_state
      })
      setCitySearch(`${user.location_city}, ${user.location_state}`)
      setSelectedCity(null)
    }
    setError('')
    setSuccess('')
  }

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if any changes were made
    const nameChanged = formData.name !== user?.name
    const locationChanged = selectedCity !== null || (formData.city !== user?.location_city || formData.state !== user?.location_state)
    
    if (!nameChanged && !locationChanged) {
      setError('No changes to save')
      return
    }

    setIsUpdating(true)
    setError('')
    
    try {
      const updateData: Record<string, unknown> = {}
      
      if (nameChanged) {
        updateData.name = formData.name
      }
      
      if (locationChanged) {
        if (formData.city_id) {
          updateData.city_id = formData.city_id
        } else if (formData.city && formData.state) {
          updateData.city = formData.city
          updateData.state = formData.state
        }
      }
      
      const result = await apiCall(`/profile/${token}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })
      
      if (result.success) {
        setUser(result.user)
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        
        // Update form state with new data
        setFormData({
          name: result.user.name,
          city_id: null,
          city: result.user.location_city,
          state: result.user.location_state
        })
        setCitySearch(`${result.user.location_city}, ${result.user.location_state}`)
        setSelectedCity(null)
      } else {
        setError(result.message || 'Failed to update profile')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Update relationship type
  const updateRelationshipType = async (connection: CircleConnection, newType: string) => {
    setIsUpdatingRelationship(connection.id)
    try {
      const result = await apiCall(`/user-profile/${token}/relationship`, {
        method: 'PUT',
        body: JSON.stringify({ 
          relationship_type: newType,
          user_a_id: connection.user_a_id,
          user_b_id: connection.user_b_id
        })
      })
      
      if (result.success) {
        // Update local circle data
        setCircle(prev => prev.map(conn => 
          conn.id === connection.id 
            ? { ...conn, relationship_type: newType }
            : conn
        ))
        setSuccess('Relationship updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.message || 'Failed to update relationship')
        setTimeout(() => setError(''), 3000)
      }
    } catch {
      setError('Network error. Please try again.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsUpdatingRelationship(null)
    }
  }

  // Copy invitation link
  const copyInvitationLink = async () => {
    if (invitationStats?.link) {
      try {
        await navigator.clipboard.writeText(invitationStats.link)
        setSuccess('Invitation link copied!')
        setTimeout(() => setSuccess(''), 2000)
      } catch {
        setError('Failed to copy link')
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  // Get relationship ring position (0 = center, 4 = outermost)
  const getRelationshipRing = (relationshipType: string): number => {
    switch (relationshipType) {
      case 'partner':
        return 0 // Center - closest relationships
      case 'family':
        return 1 // Inner ring - family members
      case 'friend':
        return 2 // Middle ring - friends
      case 'colleague':
        return 3 // Outer ring - work relationships
      case 'acquaintance':
        return 4 // Outermost ring - casual connections
      default:
        return 2 // Default to middle (friend level)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#11d0be] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </>
    )
  }

  // Invalid token state
  if (!isValidToken) {
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
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Profile Link</h1>
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
          <div className="max-w-6xl mx-auto">
            
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#11d0be] to-[#0fb8a8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
              <p className="text-gray-400 mb-1">Manage your Friday profile information</p>
              <p className="text-sm text-gray-500">First AI Social Life Assistant</p>
            </motion.div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center"
              >
                {success}
              </motion.div>
            )}

            {/* Profile Basic Info Container */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
              {!isEditing ? (
                /* Profile View Mode */
                <div className="space-y-6">
                  {/* Profile Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <div className="text-white text-lg font-medium">
                        {user?.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="text-gray-400">
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Location
                      </label>
                      <div className="text-white">
                        {user?.location_city}, {user?.location_state}
                      </div>
                      <div className="text-sm text-gray-400">
                        {user?.location_timezone}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Last Updated
                      </label>
                      <div className="text-gray-400 text-sm">
                        {user?.profile_updated_at ? formatDate(user.profile_updated_at) : 'Never'}
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={startEditing}
                    className="w-full py-3 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-lg transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                /* Profile Edit Mode */
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Edit Profile</h3>
                    <p className="text-gray-400">Update your name and location</p>
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

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                    
                    {selectedCity && (
                      <p className="text-sm text-green-400 mt-1">
                        New location: {selectedCity.display}
                      </p>
                    )}
                    
                  </div>

                  {/* State Selection - Show when manual location or city is selected */}
                  {(useManualLocation || formData.state) && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#11d0be] focus:border-transparent"
                        required={useManualLocation}
                      >
                        <option value="" className="bg-gray-900 text-white">Select your state</option>
                        {US_STATES.map((state) => (
                          <option key={state.code} value={state.code} className="bg-gray-900 text-white">
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-3 bg-[#11d0be] hover:bg-[#0fb8a8] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-300"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Concentric Circles Visualization */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-96 h-96 mx-auto"
              >
                {/* SVG Container for Circles */}
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Concentric circles as guides */}
                  <circle cx="200" cy="200" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {/* User at center */}
                  <circle cx="200" cy="200" r="20" fill="url(#userGradient)" />
                  <text x="200" y="208" textAnchor="middle" className="fill-black font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </text>
                  
                  {/* Connections positioned on rings */}
                  {circle.map((connection) => {
                    const ring = getRelationshipRing(connection.relationship_type)
                    const ringRadius = 40 + (ring * 40) // 40, 80, 120, 160, 200
                    const totalInRing = circle.filter(c => getRelationshipRing(c.relationship_type) === ring).length
                    const indexInRing = circle.filter(c => getRelationshipRing(c.relationship_type) === ring).indexOf(connection)
                    const angle = (indexInRing / totalInRing) * 2 * Math.PI
                    const x = 200 + ringRadius * Math.cos(angle)
                    const y = 200 + ringRadius * Math.sin(angle)
                    
                    return (
                      <g key={connection.id}>
                        <circle cx={x} cy={y} r="12" fill="rgba(17, 208, 190, 0.2)" stroke="#11d0be" strokeWidth="2" />
                        <text x={x} y={y + 4} textAnchor="middle" className="fill-white font-medium text-xs">
                          {connection.name.charAt(0)}
                        </text>
                        
                        {/* Curved text path for name */}
                        <defs>
                          <path id={`textPath-${connection.id}`} d={`M ${x-30} ${y} A 30 30 0 0 1 ${x+30} ${y}`} />
                        </defs>
                        <text className="fill-white text-xs">
                          <textPath href={`#textPath-${connection.id}`} startOffset="50%" textAnchor="middle">
                            {connection.name}
                          </textPath>
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#11d0be" />
                      <stop offset="100%" stopColor="#0fb8a8" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Loading overlay */}
                {isLoadingCircle && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#11d0be] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Empty state */}
                {!isLoadingCircle && circle.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">No connections yet</p>
                      <p className="text-sm text-gray-500">Share your invitation to start building your circle</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Bottom Two-Panel Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Panel: Invitation Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-[#11d0be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Your Invitation
                </h3>
                
                {isLoadingInvitation ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-[#11d0be] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading invitation stats...</p>
                  </div>
                ) : invitationStats ? (
                  <div className="space-y-4">
                    {/* Invitation Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Invitation Link
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={invitationStats.link}
                          readOnly
                          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white text-sm"
                        />
                        <button
                          onClick={copyInvitationLink}
                          className="px-4 py-3 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-medium rounded-r-lg transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    {/* Usage Stats */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#11d0be] mb-2">
                          {invitationStats.usage_count}
                        </div>
                        <div className="text-gray-300">
                          People joined using your link
                        </div>
                      </div>
                    </div>
                    
                    {/* Share Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quick Share
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                          SMS
                        </button>
                        <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-2">No invitation link found</p>
                    <p className="text-sm text-gray-500">Your invitation may have expired</p>
                  </div>
                )}
              </motion.div>
              
              {/* Right Panel: Relationship Management */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-[#11d0be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Manage Relationships
                </h3>
                
                {isLoadingCircle ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-[#11d0be] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading connections...</p>
                  </div>
                ) : circle.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {circle.map((connection) => (
                      <div key={connection.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#11d0be] to-[#0fb8a8] rounded-full flex items-center justify-center">
                            <span className="text-black font-medium text-sm">
                              {connection.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{connection.name}</div>
                            <div className="text-xs text-gray-400">{connection.relationship_type}</div>
                          </div>
                        </div>
                        
                        <select
                          value={connection.relationship_type}
                          onChange={(e) => updateRelationshipType(connection, e.target.value)}
                          disabled={isUpdatingRelationship === connection.id}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#11d0be] disabled:opacity-50"
                        >
                          {RELATIONSHIP_OPTIONS.map((option) => (
                            <option key={option} value={option} className="bg-gray-900 text-white">
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-2">No connections yet</p>
                    <p className="text-sm text-gray-500">Share your invitation link to start building your network</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
