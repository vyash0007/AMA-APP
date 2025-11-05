import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import fileStorage from '@/lib/fileStorage';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          // Use fileStorage (file-based database for development)
          
          console.log('Sign-in attempt with identifier:', credentials.identifier);
          
          const user = fileStorage.findUserByEmail(credentials.identifier) || 
                       fileStorage.findUserByUsername(credentials.identifier);
          
          if (!user) {
            console.log('User not found for identifier:', credentials.identifier);
            throw new Error('No user found with this email');
          }
          
          console.log('User found, checking password...');
          
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (isPasswordCorrect) {
            console.log('Password correct, returning user');
            return {
              id: user._id,
              email: user.email,
              username: user.username,
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
            };
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          console.error('Authorization error:', err.message);
          throw new Error(err.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
