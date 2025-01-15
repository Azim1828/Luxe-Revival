'use server'

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateUserData {
  token: string;
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}

interface User {
  id: number
  email: string
  name: string
  token?: string
  [key: string]: unknown
}

interface AuthError {
  message: string;
  code?: string;
  [key: string]: unknown;
}

export async function doUserRegister(data: RegisterData): Promise<User> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    return result;
  } catch (error: unknown) {
    const err = error as AuthError;
    throw new Error(err.message || 'Failed to register user');
  }
}

export async function doUserLogin(data: LoginData): Promise<User> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    return result;
  } catch (error: unknown) {
    const err = error as AuthError;
    throw new Error(err.message || 'Failed to login');
  }
}

export async function doLogout(): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error: unknown) {
    const err = error as AuthError;
    throw new Error(err.message || 'Failed to logout');
  }
}

export async function doUserUpdate(data: UpdateUserData): Promise<User> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Update failed');
    }

    return result;
  } catch (error: unknown) {
    const err = error as AuthError;
    throw new Error(err.message || 'Failed to update user');
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
    
    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    return null;
  }
} 