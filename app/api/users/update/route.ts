import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface UpdateUserBody {
  token: string;
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}

export async function PUT(request: Request) {
  try {
    const body: UpdateUserBody = await request.json();
    const { token, ...updateData } = body;

    // Validate token
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    // Read users file
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    // Find user by token
    const userIndex = users.findIndex((u: any) => u.token === token);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }

    // If email is being updated, check if it's already in use
    if (updateData.email && users.some((u: any, index: number) => 
      index !== userIndex && u.email === updateData.email
    )) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      timestamp: new Date().toISOString()
    };

    // Save updated users array
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    // Return updated user data (excluding password)
    const { password: _, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 