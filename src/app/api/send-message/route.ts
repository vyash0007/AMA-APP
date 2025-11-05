import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import fileStorage from '@/lib/fileStorage';

export async function POST(request: Request) {
  // Use fileStorage (file-based database for development)
  
  console.log('📨 Send-message endpoint called');
  
  try {
    const { username, content } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    console.log('📨 Received request:', { username, decodedUsername, content });

    if (!decodedUsername || !content) {
      console.log('📨 Missing username or content');
      return Response.json(
        { message: 'Username and content are required', success: false },
        { status: 400 }
      );
    }

    // Find user in fileStorage
    console.log('📨 Looking for user in file storage:', decodedUsername);
    const user = fileStorage.findUserByUsername(decodedUsername);
    console.log('📨 Found user:', user ? `${user.username} (${user._id})` : 'null');

    if (!user) {
      console.log('📨 User not found in file storage:', decodedUsername);
      console.log('📨 Available users:', fileStorage.getAllUsers().map((u: any) => u.username));
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      console.log('📨 User not accepting messages:', decodedUsername);
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 }
      );
    }

    const newMessage = { 
      _id: String(Date.now()),
      content, 
      createdAt: new Date().toISOString()
    } as any;

    // Add the new message to the user's messages array
    user.messages.push(newMessage);
    fileStorage.updateUser(user._id, user);
    console.log('📨 Message added successfully to file storage');

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error adding message:', error);
    return Response.json(
      { message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    );
  }
}
