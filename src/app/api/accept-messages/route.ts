import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  // Use MongoDB for updating message acceptance status
  
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    await dbConnect();
    const foundUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser: foundUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log('✅ GET /api/accept-messages called');
  
  // Use MongoDB to fetch message acceptance status
  
  const session = await getServerSession(authOptions);
  const user = session?.user;
  console.log('✅ User from session:', user ? `${user.username} (${user._id})` : 'null');

  if (!session || !user) {
    console.log('✅ Not authenticated');
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      console.log('✅ User not found, returning 404');
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', foundUser.username, '- returning acceptance status');
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('✅ Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}
