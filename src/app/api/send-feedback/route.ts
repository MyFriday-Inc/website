import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, type, message } = await request.json()

    // Validate required fields
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    // Email subject based on feedback type
    const getSubject = (type: string) => {
      switch (type) {
        case 'feedback':
          return '💬 New Feedback from Friday Website'
        case 'comments':
          return '🗨️ New Comment from Friday Website'
        case 'call':
          return '📞 Call Request from Friday Website'
        case 'contribution':
          return '🤝 Vision Contribution from Friday Website'
        case 'partnership':
          return '🤝 Partnership Inquiry from Friday Website'
        default:
          return '📝 New Message from Friday Website'
      }
    }

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #11d0be, #0fb8a8); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Friday Feedback</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0; text-transform: capitalize;">${type}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #11d0be; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #11d0be; margin-top: 0;">Message</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #11d0be;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              <strong>📧 Reply directly to this email to respond to ${name}</strong>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>This message was sent from the Friday website feedback form.</p>
          <p>© ${new Date().getFullYear()} Friday</p>
        </div>
      </div>
    `

    const textContent = `
Friday Feedback - ${type.toUpperCase()}

From: ${name}
Email: ${email}
Type: ${type}

Message:
${message}

---
This message was sent from the Friday website feedback form.
Reply directly to this email to respond to ${name}.
    `

    // Send email
    await transporter.sendMail({
      from: `"Friday Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: getSubject(type),
      text: textContent,
      html: htmlContent,
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback sent successfully!'
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send feedback. Please try again.' },
      { status: 500 }
    )
  }
}
