// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

declare global {
  var __demoUsers: any[] | undefined;
}

global.__demoUsers = global.__demoUsers || [];
const userStore = global.__demoUsers;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = userStore.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Determine the name to include in the token based on user type
    let userName = '';
    if (user.type === 'investor' && user.firstName) {
      userName = user.firstName;
    } else if (user.type === 'startup' && user.founderName) {
      userName = user.founderName;
    } else {
      userName = user.email.split('@')[0]; // Fallback to part of email if name not found
    }

    // Generate JWT, now including the user's name
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: user.type, name: userName }, // Added 'name'
      'your_jwt_secret', // Use a strong secret from .env in production
      { expiresIn: '1h' }
    );

    return NextResponse.json({ message: 'Logged in successfully!', token }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
