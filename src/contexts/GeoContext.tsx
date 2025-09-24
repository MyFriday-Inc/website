'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useGeoLocation } from '@/hooks/useGeoLocation'

interface GeoContextType {
  country: string
  countryCode: string
  isUS: boolean
  isLoading: boolean
  error: string | null
}

const GeoContext = createContext<GeoContextType | undefined>(undefined)

export const useGeo = (): GeoContextType => {
  const context = useContext(GeoContext)
  if (context === undefined) {
    throw new Error('useGeo must be used within a GeoProvider')
  }
  return context
}

interface GeoProviderProps {
  children: ReactNode
}

export const GeoProvider = ({ children }: GeoProviderProps) => {
  const geoData = useGeoLocation()

  return (
    <GeoContext.Provider value={geoData}>
      {children}
    </GeoContext.Provider>
  )
}
