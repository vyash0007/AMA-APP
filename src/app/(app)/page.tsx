'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncognitoIcon } from '@/components/IncognitoIcon';
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
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-black text-white">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Anonymous Feedback Platform
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Share honest feedback anonymously. Get real insights. Build authentic connections.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button className="bg-white hover:bg-gray-200 text-black px-8 py-6 rounded-full font-semibold transition-all">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 rounded-full font-semibold transition-all">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-white transition-all">
            <CardHeader>
              <CardTitle className="text-white">Completely Anonymous</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Send feedback without revealing your identity. Complete privacy guaranteed.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-white transition-all">
            <CardHeader>
              <CardTitle className="text-white">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Instant delivery and real-time notifications for all your messages.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-white transition-all">
            <CardHeader>
              <CardTitle className="text-white">Easy Sharing</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
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
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-white transition-all">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-3">
                      <div className="flex items-start space-x-3">
                        <Mail className="flex-shrink-0 w-5 h-5 text-white mt-1" />
                        <p className="text-gray-300">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-6">
              <CarouselPrevious className="static translate-y-0 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all" />
              <CarouselNext className="static translate-y-0 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all" />
            </div>
          </Carousel>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 md:p-8 bg-black border-t border-zinc-800 text-gray-400">
        <p>© 2025 Anonymous Feedback. All rights reserved.</p>
        <p className="text-sm mt-2 text-gray-500">Share authentically. Grow meaningfully.</p>
      </footer>
    </>
  );
}
