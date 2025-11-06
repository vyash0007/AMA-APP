'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
            Anonymous Feedback Platform
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Share honest feedback anonymously. Get real insights. Build authentic connections.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/50">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-6 rounded-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Completely Anonymous</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Send feedback without revealing your identity. Complete privacy guaranteed.
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <CardHeader>
              <Zap className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Instant delivery and real-time notifications for all your messages.
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Easy Sharing</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Share your link and receive authentic feedback from anyone, anytime.
            </CardContent>
          </Card>
        </section>

        {/* Carousel for Messages */}
        <section className="w-full max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Recent Feedback</h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500/50 transition-all">
                    <CardHeader>
                      <CardTitle className="text-purple-300 text-lg">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-3">
                      <div className="flex items-start space-x-3">
                        <Mail className="flex-shrink-0 w-5 h-5 text-purple-400 mt-1" />
                        <p className="text-gray-200">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative position-static border-purple-400 text-purple-400 hover:bg-purple-400/10" />
              <CarouselNext className="relative position-static border-purple-400 text-purple-400 hover:bg-purple-400/10" />
            </div>
          </Carousel>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 md:p-8 bg-slate-950 border-t border-slate-800 text-gray-400">
        <p>© 2025 Anonymous Feedback. All rights reserved.</p>
        <p className="text-sm mt-2 text-gray-500">Share authentically. Grow meaningfully.</p>
      </footer>
    </>
  );
}
