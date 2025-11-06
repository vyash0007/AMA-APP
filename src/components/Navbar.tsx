'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { MessageSquare, LogOut, LogIn } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Anonymous Feedback
            </span>
          </Link>

          {/* Right side */}
          {session ? (
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="text-sm md:text-base">
                <span className="text-gray-400">Welcome, </span>
                <span className="text-purple-300 font-semibold">
                  {user?.username || user?.email}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-700 hidden md:block"></div>
              <Link href="/dashboard">
                <Button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-purple-300 hover:text-purple-200 rounded-lg transition-all text-sm">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => signOut()}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all flex gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Link href="/sign-in">
                <Button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-purple-300 hover:text-purple-200 rounded-lg transition-all flex gap-2 text-sm">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all text-sm font-semibold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
