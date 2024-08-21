//app/(welcome)/welcome/page.jsx
'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Image from 'next/image';

export default function Welcome() {
  const router = useRouter();
  const { user } = useAuth();



  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-teal-800">Welcome {user?.displayName || "Guest"}</CardTitle>
        <CardDescription className="text-center text-teal-600">To Your Intelligent Health Companion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <img src="/images/logo.png" alt="Medcheck AI" className="h-24" />
        </div>
        <p className="text-center text-teal-700">We're here to provide personalized health insights. Let's start by getting to know you better.</p>
        <div className="flex items-center justify-center space-x-2">
          <Image src='/icons/secure.svg' width={20} height={20} alt="secure logo"/>
          <p className="text-sm text-gray-500">Your data is confidential and secured following HIPAA and GDPR standards.</p>
        </div>
      </CardContent>
      <CardFooter className='justify-center'>
        <Button onClick={() => router.push('/welcome/introduction')} className="w-1/2 md:w-1/5 bg-teal-500 hover:bg-teal-700 rounded-xl">Begin</Button>
       </CardFooter>
     </>
   );
 }