import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  // Use MongoDB to send messages
  
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

    // Find user in MongoDB
    await dbConnect();
    console.log('📨 Looking for user in MongoDB:', decodedUsername);
    const user = await User.findOne({ username: decodedUsername });
    console.log('📨 Found user:', user ? `${user.username} (${user._id})` : 'null');

    if (!user) {
      console.log('📨 User not found in MongoDB:', decodedUsername);
      const allUsers = await User.find({}, 'username');
      console.log('📨 Available users:', allUsers.map((u: any) => u.username));
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
      content, 
      createdAt: new Date()
    } as any;

    // Add the new message to the user's messages array
    user.messages.push(newMessage);
    await user.save();
    console.log('📨 Message added successfully to MongoDB');

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
