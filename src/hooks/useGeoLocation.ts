'use client'

import { useState, useEffect } from 'react'

interface GeoLocationData {
  country: string
  countryCode: string
  isUS: boolean
  isLoading: boolean
  error: string | null
}

const CACHE_KEY = 'friday_geo_data'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const useGeoLocation = (): GeoLocationData => {
  const [geoData, setGeoData] = useState<GeoLocationData>({
    country: '',
    countryCode: '',
    isUS: true, // Default to US to allow access if detection fails
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          const isExpired = Date.now() - timestamp > CACHE_DURATION
          
          if (!isExpired) {
            setGeoData({
              ...data,
              isLoading: false,
              error: null
            })
            return
          }
        }

        // Fetch from API (using ipapi.co - free, works with HTTPS)
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          // Add timeout
          signal: AbortSignal.timeout(5000)
        })

        if (!response.ok) {
          throw new Error('Failed to fetch location data')
        }

        const data = await response.json()
        
        if (data.country && data.country_code) {
          const locationData = {
            country: data.country_name || data.country || '',
            countryCode: data.country_code || data.country || '',
            isUS: data.country_code === 'US',
            isLoading: false,
            error: null
          }

          // Cache the result
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: locationData,
            timestamp: Date.now()
          }))

          // Log for debugging
          console.log('🌍 Detected Country:', locationData.country, `(${locationData.countryCode})`, locationData.isUS ? '- US User ✅' : '- International User 🌎')

          setGeoData(locationData)
        } else {
          throw new Error('Location detection failed')
        }
      } catch (error) {
        console.warn('Geo-location detection failed:', error)
        // Default to US access if detection fails
        const fallbackData = {
          country: 'Unknown',
          countryCode: 'US',
          isUS: true,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Detection failed'
        }
        setGeoData(fallbackData)
      }
    }

    detectLocation()
  }, [])

  return geoData
}
