import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import fileStorage from '@/lib/fileStorage';

export async function POST(request: Request) {
  // Use fileStorage (file-based database for development)
  
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
    const foundUser = fileStorage.findUserById(userId as string);
    
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    foundUser.isAcceptingMessages = acceptMessages;
    fileStorage.updateUser(userId as string, foundUser);

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
  
  // Use fileStorage (file-based database for development)
  
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
    const foundUser = fileStorage.findUserById(user._id as string);

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
