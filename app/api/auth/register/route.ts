import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token?: string;
  address?: string;
  phone?: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Read existing users
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users: User[] = JSON.parse(usersData);

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      password,
      timestamp: new Date().toISOString()
    };

    // Add user to array
    users.push(newUser);

    // Save updated users array
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    // Return success response (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 