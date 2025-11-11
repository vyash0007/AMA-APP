'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          // Set the message regardless of success status
          // axios only rejects on 4xx/5xx, so we get 200 responses here
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/sign-in`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm">Join our anonymous feedback community</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                    placeholder="Choose a unique username"
                  />
                  {isCheckingUsername && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Checking availability...
                    </div>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm font-medium ${
                        usernameMessage === 'Username is unique'
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <Input 
                    {...field} 
                    name="email"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                    placeholder="your@email.com"
                  />
                  <p className='text-gray-500 text-xs'>We&apos;ll send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <Input 
                    type="password" 
                    {...field} 
                    name="password"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                    placeholder="••••••••"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className='w-full bg-white hover:bg-gray-200 text-black font-semibold py-2 rounded-md transition-all' 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6 pt-6 border-t border-zinc-800">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-white hover:text-gray-300 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

