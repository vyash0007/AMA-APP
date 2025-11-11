'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to access your feedback</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email or Username</FormLabel>
                  <Input 
                    {...field}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                    placeholder="your@email.com or username"
                  />
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
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                    placeholder="••••••••"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className='w-full bg-white hover:bg-gray-200 text-black font-semibold py-2 rounded-md transition-all' 
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center pt-6 border-t border-zinc-800">
          <p className="text-gray-400 text-sm">
            New here?{' '}
            <Link href="/sign-up" className="text-white hover:text-gray-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
