import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByFirebaseUid } from '@/lib/services/userService';

export async function POST(request: NextRequest) {
  try {
    const { firebase_uid, email, display_name, avatar_url } = await request.json();
    
    if (!firebase_uid || !email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: firebase_uid and email'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getUserByFirebaseUid(firebase_uid);
    if (existingUser) {
      return NextResponse.json({
        success: true,
        user: existingUser,
        message: 'User already exists'
      });
    }

    // Create new user
    const newUser = await createUser({
      firebase_uid,
      email,
      display_name,
      avatar_url
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('User creation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create user'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firebase_uid = searchParams.get('firebase_uid');
    
    if (!firebase_uid) {
      return NextResponse.json({
        success: false,
        error: 'Missing firebase_uid parameter'
      }, { status: 400 });
    }

    const user = await getUserByFirebaseUid(firebase_uid);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('User retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve user'
    }, { status: 500 });
  }
}
