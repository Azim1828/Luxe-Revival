import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

interface User {
  id: string
  email: string
  token?: string
}

export async function POST() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (token) {
      const usersPath = path.join(process.cwd(), 'data', 'users.json')
      const usersData = await fs.readFile(usersPath, 'utf-8')
      const users: User[] = JSON.parse(usersData)
      
      const updatedUsers = users.map(user => 
        user.token === token.value ? { ...user, token: undefined } : user
      )

      await fs.writeFile(usersPath, JSON.stringify(updatedUsers, null, 2))
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
} 