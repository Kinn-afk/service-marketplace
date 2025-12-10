import { NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt for:', email); // Debug log

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    console.log('User found:', user ? 'Yes' : 'No'); // Debug log

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isValid); // Debug log

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    return NextResponse.json({ 
      error: 'Login failed: ' + error.message 
    }, { status: 500 });
  }
}
