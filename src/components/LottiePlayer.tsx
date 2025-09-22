'use client'

import Lottie from 'lottie-react'
import heroAnimation from '../../public/images/Hero.json'

export default function LottiePlayer() {
  return (
    <Lottie
      animationData={heroAnimation}
      loop={true}
      autoplay={true}
      className="w-full h-auto"
      style={{
        maxWidth: '100%',
        height: 'auto',
        transform: 'scale(1.5)'
      }}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice',
        progressiveLoad: true
      }}
    />
  )
}
