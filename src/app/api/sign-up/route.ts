import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/schemas/signUpSchema';
import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  // Use MongoDB for user registration
  
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

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return Response.json(
        {
          success: false,
          message: 'Database connection failed. Please try again later.',
        },
        { status: 503 }
      );
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
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
    
    // Create new user in MongoDB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
      isAcceptingMessages: true,
      messages: [],
    });

    console.log('✨ New user created (MongoDB):', { username, email, id: newUser._id });

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
