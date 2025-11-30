import Image from "next/image";
import { Stethoscope, Quote } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(
    (img) => img.id === "login-background"
  );

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={loginBg?.imageUrl || "/placeholder.svg"}
          alt={loginBg?.description || "Login background image"}
          data-ai-hint={loginBg?.imageHint}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
                <Quote className="w-12 h-12 text-primary-foreground/50 mb-4" />
                <blockquote className="text-xl italic font-medium">
                    "HealthHub has been a game-changer for our rural clinic. The AI-powered insights help us prioritize cases and provide better care to our community."
                </blockquote>
                <p className="mt-4 font-semibold">— Dr. Anjali Sharma, Community Health Officer</p>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
                <Stethoscope className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">HealthHub Rural</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Automatic Patient Health Record Monitoring System
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
