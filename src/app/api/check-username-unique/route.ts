import { findUserByUsername } from '@/lib/memoryStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usernameParam = searchParams.get('username');

    if (!usernameParam || usernameParam.trim() === '') {
      return Response.json(
        {
          success: false,
          message: 'Username is required',
        },
        { status: 400 }
      );
    }

    const username = usernameParam.trim();

    // Check in-memory users
    const existingUser = findUserByUsername(username);

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    // Username is unique
    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  }
}
