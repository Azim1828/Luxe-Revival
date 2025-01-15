import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Read users file
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    // Find user
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Update user's token
    user.token = token;
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    // Return user data with token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 