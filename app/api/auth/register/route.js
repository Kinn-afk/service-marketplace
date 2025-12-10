import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be 6+ characters' }, { status: 400 });
    }

    // Check existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const userId = await createUser(email, password, name, role || 'customer');
    return NextResponse.json({ message: 'User created', userId }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Registration failed: ' + error.message 
    }, { status: 500 });
  }
}