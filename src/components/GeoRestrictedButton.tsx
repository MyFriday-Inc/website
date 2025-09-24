'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useGeo } from '@/contexts/GeoContext'

interface GeoRestrictedButtonProps {
  children: ReactNode
  onClick?: () => void
  onInternationalClick: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  internationalText?: string
}

export default function GeoRestrictedButton({
  children,
  onClick,
  onInternationalClick,
  className = '',
  disabled = false,
  type = 'button',
  internationalText = 'US Only - Join International List'
}: GeoRestrictedButtonProps) {
  const { isUS, isLoading } = useGeo()

  const handleClick = () => {
    if (isLoading) return
    
    if (isUS) {
      onClick?.()
    } else {
      onInternationalClick()
    }
  }

  const isDisabled = disabled || isLoading || !isUS

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`${className} ${
        isDisabled 
          ? 'opacity-60 cursor-not-allowed bg-gray-600' 
          : 'hover:scale-[1.02] active:scale-[0.98]'
      } transition-all duration-200`}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      title={!isUS && !isLoading ? 'Currently available in US only' : undefined}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </span>
      ) : !isUS ? (
        internationalText
      ) : (
        children
      )}
    </motion.button>
  )
}
