
"use client";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { chatWithAI } from "@/ai/flows/chat-with-ai";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { demoUser } from "@/lib/data";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export function ChatModal({
  isOpen,
  onClose,
  patientId,
  patientName,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatWithAI({
        patientId,
        message: input,
      });
      const aiMessage: Message = { sender: "ai", text: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat with AI failed:", error);
      const errorMessage: Message = {
        sender: "ai",
        text: "Sorry, I couldn't process that request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[70vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Chat with AI about {patientName}
          </DialogTitle>
          <DialogDescription>
            Ask questions about the patient's case. The AI has access to their full medical history.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="flex-1 pr-6 -mr-6" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-md",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.sender === "user" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                     <AvatarImage src={demoUser.avatarUrl} alt={demoUser.name} />
                    <AvatarFallback>{demoUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback>
                        <Bot className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted w-40">
                    <Skeleton className="h-4 w-full" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="pt-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
