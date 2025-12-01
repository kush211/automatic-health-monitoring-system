
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

export default function SupportPage() {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out both the subject and message fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the admin team.',
      });
      setSubject('');
      setMessage('');
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Have a question or need assistance? Send a message to our admin team.
        </p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              We'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Issue with patient record"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue or question in detail..."
                rows={8}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
