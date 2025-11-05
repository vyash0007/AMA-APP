import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    try {
      // Find user in MongoDB
      const user = await User.findOne({ username: decodedUsername });

      if (!user) {
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      // Verify the code
      if (user.verifyCode === code) {
        user.isVerified = true;
        user.verifyCode = '';
        user.verifyCodeExpiry = null as any;
        await user.save();

        return Response.json(
          { success: true, message: 'Account verified successfully' },
          { status: 200 }
        );
      } else {
        return Response.json(
          { success: false, message: 'Incorrect verification code' },
          { status: 400 }
        );
      }
    } catch (queryError) {
      console.warn('Database query error:', queryError);
      return Response.json(
        { success: false, message: 'Error verifying user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error processing request' },
      { status: 500 }
    );
  }
}
