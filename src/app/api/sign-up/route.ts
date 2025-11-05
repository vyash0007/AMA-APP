import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/schemas/signUpSchema';
import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import fileStorage from '@/lib/fileStorage';

export async function POST(request: Request) {
  // Use devStorage (in-memory database for development)
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return Response.json(
        {
          success: false,
          message: 'Invalid JSON format',
        },
        { status: 400 }
      );
    }

    // Validate the request body against the schema
    const validationResult = signUpSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ');
      return Response.json(
        {
          success: false,
          message: `Validation error: ${errors}`,
        },
        { status: 400 }
      );
    }

    const { username, email, password } = validationResult.data;

    // Check if username already exists
    if (fileStorage.findUserByUsername(username)) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (fileStorage.findUserByEmail(email)) {
      return Response.json(
        {
          success: false,
          message: 'User already exists with this email',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user in fileStorage
    const newUser = fileStorage.createUser({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
      isAcceptingMessages: true,
      messages: [],
    });

    console.log('✨ New user created (fileStorage):', { username, email, id: newUser._id });

    return Response.json(
      {
        success: true,
        message: 'User registered successfully! You can now sign in.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return Response.json(
      {
        success: false,
        message: `Error registering user: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
