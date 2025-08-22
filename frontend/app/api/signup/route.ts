// app/api/signup/route.ts
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
    const {
      email,
      password,
      signupType,
      // Investor fields
      firstName,
      lastName,
      investmentFirm,
      investmentRange,
      preferredSectors,
      // Startup fields
      founderName,
      startupName,
      industrySector,
      fundingStage,
      companyDescription
    } = await request.json();

    if (!email || !password || !signupType) {
      return NextResponse.json({ message: 'Email, password, and signup type are required' }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    if (userStore.find(user => user.email === email)) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: any = {
      id: userStore.length + 1,
      email,
      password: hashedPassword,
      type: signupType
    };

    if (signupType === 'investor') {
      Object.assign(newUser, {
        firstName, // Ensure firstName is saved
        lastName,
        investmentFirm,
        investmentRange,
        preferredSectors
      });
    } else { // startup
      Object.assign(newUser, {
        founderName, // Ensure founderName is saved
        startupName,
        industrySector,
        fundingStage,
        companyDescription
      });
    }

    userStore.push(newUser);
    console.log("New user signed up:", newUser);

    // Determine the name to include in the token during signup as well (optional, but good for consistency)
    let userName = '';
    if (newUser.type === 'investor' && newUser.firstName) {
      userName = newUser.firstName;
    } else if (newUser.type === 'startup' && newUser.founderName) {
      userName = newUser.founderName;
    } else {
      userName = newUser.email.split('@')[0];
    }

    const token = jwt.sign({ userId: newUser.id, email: newUser.email, type: newUser.type, name: userName }, 'your_jwt_secret', { expiresIn: '1h' });

    return NextResponse.json({ message: 'Account created successfully!', token }, { status: 201 });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
