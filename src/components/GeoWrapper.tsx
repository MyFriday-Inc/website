'use client'

import { useState } from 'react'
import { GeoProvider } from '@/contexts/GeoContext'
import { GeoModalProvider } from '@/components/GeoModalProvider'
import GeoRestrictionBanner from '@/components/GeoRestrictionBanner'
import InternationalModal from '@/components/InternationalModal'

interface GeoWrapperProps {
  children: React.ReactNode
}

export default function GeoWrapper({ children }: GeoWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <GeoProvider>
      <GeoModalProvider onOpenModal={openModal}>
        <GeoRestrictionBanner onOpenModal={openModal} />
        {children}
        <InternationalModal isOpen={isModalOpen} onClose={closeModal} />
      </GeoModalProvider>
    </GeoProvider>
  )
}
