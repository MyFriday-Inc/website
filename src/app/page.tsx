import Header from '@/components/Header'
import Hero from '@/components/Hero'
import SignupSection from '@/components/SignupSection'
import HowItWorks from '@/components/HowItWorks'
import VisionAndCTA from '@/components/VisionAndCTA'
import FeedbackSection from '@/components/FeedbackSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SignupSection />
        <VisionAndCTA />
        <FeedbackSection />
      </main>
      <Footer />
    </>
  )
} 