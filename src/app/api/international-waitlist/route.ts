import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, country, timestamp } = body

    // Validate input
    if (!email || !country) {
      return NextResponse.json(
        { error: 'Email and country are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // TODO: Replace this with your actual backend integration
    // For now, we'll log the data and return success
    console.log('International waitlist signup:', {
      email,
      country,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    })

    // Here you would typically:
    // 1. Save to your database
    // 2. Add to email marketing list (Mailchimp, ConvertKit, etc.)
    // 3. Send confirmation email
    // 4. Integrate with your existing backend

    // Example of what you might do:
    /*
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/international-waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        email,
        country,
        timestamp,
        source: 'website'
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to save to database')
    }
    */

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to international waitlist' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('International waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
