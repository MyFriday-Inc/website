'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
  profile_updated_at: string
}

export default function ProfilePage() {
  const params = useParams()
  const token = params.token as string
  
  // Profile states
  const [isLoading, setIsLoading] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    city_id: null as number | null
  })
  const [citySearch, setCitySearch] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showCities, setShowCities] = useState(false)
  
  // UI states
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
            city_id: null // We'll need to find the city_id if they want to change location
          })
          setCitySearch(`${result.user.location_city}, ${result.user.location_state}`)
        } else {
          setIsValidToken(false)
          setError(result.message || 'Invalid profile token')
        }
      } catch (error) {
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

  // Search cities
  const searchCities = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setCities([])
      setShowCities(false)
      return
    }
    
    setIsSearching(true)
    try {
      const result = await apiCall(`/cities?search=${encodeURIComponent(searchTerm)}`)
      if (result.success) {
        setCities(result.cities)
        setShowCities(true)
      }
    } catch (error) {
      console.error('City search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle city search input
  const handleCitySearch = (value: string) => {
    setCitySearch(value)
    setSelectedCity(null)
    setFormData(prev => ({ ...prev, city_id: null }))
    searchCities(value)
  }

  // Select city
  const selectCity = (city: City) => {
    setSelectedCity(city)
    setCitySearch(city.display)
    setFormData(prev => ({ ...prev, city_id: city.id }))
    setShowCities(false)
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
        city_id: null
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
    const locationChanged = selectedCity !== null
    
    if (!nameChanged && !locationChanged) {
      setError('No changes to save')
      return
    }

    setIsUpdating(true)
    setError('')
    
    try {
      const updateData: any = {}
      
      if (nameChanged) {
        updateData.name = formData.name
      }
      
      if (locationChanged && formData.city_id) {
        updateData.city_id = formData.city_id
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
          city_id: null
        })
        setCitySearch(`${result.user.location_city}, ${result.user.location_state}`)
        setSelectedCity(null)
      } else {
        setError(result.message || 'Failed to update profile')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsUpdating(false)
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
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-[#11d0be] hover:bg-[#0fb8a8] text-black font-bold rounded-lg transition-all duration-300"
            >
              Go to Homepage
            </a>
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
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 mt-20">
          <div className="max-w-md mx-auto">
            
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

            {/* Profile Container */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              
              {!isEditing ? (
                /* Profile View Mode */
                <div className="space-y-6">
                  {/* Profile Info */}
                  <div className="space-y-4">
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
                        Timezone: {user?.location_timezone}
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
          </div>
        </div>
      </section>
    </>
  )
}
