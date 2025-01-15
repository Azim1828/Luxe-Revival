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

export async function doUserRegister(data: RegisterData) {
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

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to register user'
    };
  }
}

export async function doUserLogin(data: LoginData) {
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

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to login'
    };
  }
}

export async function doLogout(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Logout failed');
    }

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to logout'
    };
  }
}

export async function doUserUpdate(data: UpdateUserData) {
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

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update user'
    };
  }
} 