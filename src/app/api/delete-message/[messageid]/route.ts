import { getServerSession } from 'next-auth/next';
import { User } from 'next-auth';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import fileStorage from '@/lib/fileStorage';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  // Use fileStorage (file-based database for development)
  
  const messageId = params.messageid;
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Find user in fileStorage
    const user = fileStorage.findUserById(_user._id as string);

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Find and remove the message
    const messageIndex = (user.messages || []).findIndex(
      (msg: any) => msg._id === messageId
    );

    if (messageIndex === -1) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    user.messages.splice(messageIndex, 1);
    fileStorage.updateUser(_user._id as string, user);

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}
