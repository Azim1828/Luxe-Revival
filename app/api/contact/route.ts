import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create new message object
    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    }

    // Read existing messages
    const filePath = path.join(process.cwd(), 'data', 'contact-messages.json')
    let messages: ContactMessage[] = []

    try {
      const fileData = await fs.readFile(filePath, 'utf-8')
      messages = JSON.parse(fileData)
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      messages = []
    }

    // Add new message
    messages.push(newMessage)

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2))

    // Here you could also add email notification logic
    // await sendEmailNotification(newMessage)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 