import { Metadata } from 'next'
import InvitePageClient from './invite-client'

// Server-side metadata generation for social sharing
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  
  try {
    // Fetch invitation details for metadata
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const response = await fetch(`${baseUrl}/invitation/${token}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY!,
      },
      // Add cache control for better performance
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    const result = await response.json()
    
    if (result.success && result.valid && result.invitation) {
      const { inviter_name, inviter_city } = result.invitation
      const title = `Join ${inviter_name} on Friday`
      const description = `${inviter_name} from ${inviter_city} has invited you to join Friday - the world's first AI-powered social life assistant.`
      const url = `https://myfriday.app/invite/${token}`
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url,
          siteName: 'Friday',
          images: [
            {
              url: '/images/invite-share.png',
              width: 1200,
              height: 630,
              alt: `Join ${inviter_name} on Friday`,
            }
          ],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [
            {
              url: '/images/invite-share.png',
              width: 1200,
              height: 630,
              alt: `Join ${inviter_name} on Friday`,
            }
          ],
        },
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata for invite:', error)
  }
  
  // Fallback metadata
  return {
    title: 'Join Friday - AI Social Life Assistant',
    description: 'You\'ve been invited to join Friday - the world\'s first AI-powered social life assistant.',
    openGraph: {
      title: 'Join Friday - AI Social Life Assistant',
      description: 'You\'ve been invited to join Friday - the world\'s first AI-powered social life assistant.',
      url: `https://myfriday.app/invite/${token}`,
      images: ['/images/social-share.png'],
    },
  }
}

// Server component wrapper that renders the client component
export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <InvitePageClient token={token} />
}
