import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Friday - AI Social Life Assistant',
  description: 'The World\'s First AI-Powered Social Life Assistant. Friday makes sure you actually talk, meet, and stay close with the people who matter.',
  icons: {
    icon: '/images/logo1.png',
    apple: '/images/logo1.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BJJ0V6C5SN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BJJ0V6C5SN');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
} 