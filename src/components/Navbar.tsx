'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LogOut, LogIn } from 'lucide-react';
import { IncognitoIcon } from './IncognitoIcon';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className="bg-black border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-white rounded-none">
              <IncognitoIcon className="text-black" size={24} />
            </div>
            <span className="text-xl font-bold text-white">
              Anonymous Feedback
            </span>
          </Link>

          {/* Right side */}
          {session ? (
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="text-sm md:text-base">
                <span className="text-gray-400">Welcome, </span>
                <span className="text-white font-semibold">
                  {user?.username || user?.email}
                </span>
              </div>
              <div className="w-px h-6 bg-zinc-800 hidden md:block"></div>
              <Link href="/dashboard">
                <Button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-full transition-all text-sm">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => signOut()}
                className="bg-white hover:bg-gray-200 text-black rounded-full transition-all flex gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/sign-in">
                <Button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-full transition-all flex gap-2 text-sm">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-white hover:bg-gray-200 text-black rounded-full transition-all text-sm">
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
