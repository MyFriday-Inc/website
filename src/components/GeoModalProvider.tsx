'use client'

import { createContext, useContext, ReactNode } from 'react'

interface GeoModalContextType {
  openInternationalModal: () => void
}

const GeoModalContext = createContext<GeoModalContextType | undefined>(undefined)

export const useGeoModal = (): GeoModalContextType => {
  const context = useContext(GeoModalContext)
  if (context === undefined) {
    throw new Error('useGeoModal must be used within a GeoModalProvider')
  }
  return context
}

interface GeoModalProviderProps {
  children: ReactNode
  onOpenModal: () => void
}

export const GeoModalProvider = ({ children, onOpenModal }: GeoModalProviderProps) => {
  return (
    <GeoModalContext.Provider value={{ openInternationalModal: onOpenModal }}>
      {children}
    </GeoModalContext.Provider>
  )
}
