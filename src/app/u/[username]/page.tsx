'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
// Replaced useCompletion with manual fetch to avoid streaming format mismatch
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [completion, setCompletion] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState<boolean>(false);
  const [suggestError, setSuggestError] = useState<Error | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    try {
      const res = await fetch('/api/suggest-messages', { method: 'POST' });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.message || errBody?.error || 'Failed to fetch suggestions');
      }
      const data = await res.json();
      const text = typeof data?.text === 'string' ? data.text : '';
      setCompletion(text || initialMessageString);
    } catch (e: any) {
      console.error('Error fetching messages:', e);
      setSuggestError(e);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Send Anonymous Feedback
          </h1>
          <p className="text-gray-400 text-lg">
            Send a message to <span className="text-white font-semibold">@{username}</span>
          </p>
        </div>

        {/* Message Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-none p-8 mb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 text-base">Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your honest and anonymous feedback here..."
                        className="resize-none bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-white min-h-32 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled className="bg-zinc-700 text-white px-8 py-2 rounded-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !messageContent}
                    className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Message
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Suggested Messages */}
        <div className="space-y-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Suggested Messages</h3>
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-full transition-all text-sm"
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Get Ideas
                  </>
                )}
              </Button>
            </div>
            <p className="text-gray-400 text-sm mb-4">Click any suggestion to use it</p>
            
            <div className="space-y-2">
              {suggestError ? (
                <div className="text-white bg-zinc-800 border border-zinc-700 rounded-none p-3">
                  {suggestError.message}
                </div>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    onClick={() => handleMessageClick(message)}
                    className="w-full justify-start text-left bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-white text-gray-300 hover:text-white rounded-full transition-all py-3 px-4 h-auto"
                    variant="ghost"
                  >
                    <span className="line-clamp-2">{message}</span>
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-none p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Want Your Own Board?</h3>
          <p className="text-gray-400 mb-6">Create an account to receive anonymous feedback from anyone</p>
          <Link href={'/sign-up'}>
            <Button className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-2 rounded-full transition-all">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
