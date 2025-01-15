import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Read users file
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    // Find user with token and remove it
    const user = users.find((u: any) => u.token === token);
    if (user) {
      user.token = null;
      await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    }

    return NextResponse.json({ message: 'Logged out successfully' });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 