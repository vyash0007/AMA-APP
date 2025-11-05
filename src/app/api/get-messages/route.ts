import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  console.log('📥 GET /api/get-messages called');
  
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  console.log('📥 User from session:', _user ? `${_user.username} (${_user._id})` : 'null');

  if (!session || !_user) {
    console.log('📥 Not authenticated');
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Use MongoDB to fetch user messages
    await dbConnect();
    console.log('📥 Querying MongoDB with ID:', _user._id);
    const user = await UserModel.findById(_user._id);

    if (!user) {
      console.log('📥 User not found, returning 404');
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    console.log('📥 User found:', user.username, '- proceeding to fetch messages');
    // Return user's messages sorted by creation date (newest first)
    const messages = (user.messages || []).sort((a: any, b: any) => {
      const timeA = new Date(b.createdAt || Date.now()).getTime();
      const timeB = new Date(a.createdAt || Date.now()).getTime();
      return timeA - timeB;
    });

    console.log('📥 Returning', messages.length, 'messages');
    return Response.json(
      { messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('📥 An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
