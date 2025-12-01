
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const ADMIN_PIN = '101010';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVerify = () => {
    if (!mounted) return;
    setIsVerifying(true);
    if (pin === ADMIN_PIN) {
      toast({
        title: 'Access Granted',
        description: 'Welcome to the Administrator Panel.',
      });
      localStorage.setItem('userRole', 'Admin');
      router.push('/admin/dashboard');
    } else {
      toast({
        title: 'Access Denied',
        description: 'The PIN you entered is incorrect.',
        variant: 'destructive',
      });
      setPin('');
    }
    setTimeout(() => setIsVerifying(false), 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8 flex items-center gap-2">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-primary text-2xl">HealthHub Rural</h1>
        </div>
         <div className="absolute top-8 right-8">
           <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Staff Login
          </Link>
        </div>
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel Access</h1>
        <p className="mb-8 text-muted-foreground">
          Enter your 6-digit security PIN to continue.
        </p>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={pin}
            onChange={(value) => setPin(value)}
            onComplete={handleVerify}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          onClick={handleVerify}
          disabled={isVerifying || pin.length < 6}
          className="mt-8 w-full"
          size="lg"
        >
          {isVerifying ? 'Verifying...' : 'Verify and Enter'}
        </Button>
      </div>
    </div>
  );
}
