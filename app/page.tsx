'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-background py-8 px-4'>
      <Card className='w-full '>
        <CardHeader className='max-md:text-center'>
          <Image
            src='/lipton.svg'
            alt='Supervisor Reports Logo'
            className='max-md:m-auto'
            width={48}
            height={48}
          />
          <CardTitle>Supervisor Reports System</CardTitle>
          <CardDescription>Login with your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
