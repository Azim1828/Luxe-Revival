import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateToken } from '@/lib/auth';

interface User {
  id: string
  email: string
  password: string
  name: string
  token?: string
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const usersPath = path.join(process.cwd(), 'data', 'users.json')
    const usersData = await fs.readFile(usersPath, 'utf-8')
    const users: User[] = JSON.parse(usersData)
    
    const user = users.find(user => user.email === email)

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken()
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, token } : u
    )

    await fs.writeFile(usersPath, JSON.stringify(updatedUsers, null, 2))

    // Set cookie
    const response = NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    })
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
} 