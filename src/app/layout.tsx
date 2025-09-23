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
  metadataBase: new URL('https://myfriday.app'),
  title: 'World\'s 1st Social Life AI Assistant',
  description: 'Friday automates your social life so relationships don\'t drift. Turning "we should hang out" into actual plans with proactive suggestions and smart coordination.',
  icons: {
    icon: '/images/logo1.png',
    apple: '/images/logo1.png',
  },
  openGraph: {
    title: 'World\'s 1st Social Life AI Assistant',
    description: 'Friday automates your social life so relationships don\'t drift. Turning "we should hang out" into actual plans.',
    images: [
      {
        url: '/images/social-share.png',
        width: 1200,
        height: 630,
        alt: 'Friday - World\'s 1st Social Life AI Assistant',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World\'s 1st Social Life AI Assistant',
    description: 'Friday automates your social life so relationships don\'t drift. Turning "we should hang out" into actual plans.',
    images: [
      {
        url: '/images/social-share.png',
        width: 1200,
        height: 630,
        alt: 'Friday - World\'s 1st Social Life AI Assistant',
      }
    ],
  },
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