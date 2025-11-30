import Image from "next/image";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(
    (img) => img.id === "login-background"
  );

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden h-full w-full lg:block">
        <Image
          src={loginBg?.imageUrl || "/placeholder.svg"}
          alt={loginBg?.description || "Login background image"}
          data-ai-hint={loginBg?.imageHint}
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
          <HeartPulse className="h-8 w-8" />
          <h1 className="text-2xl font-bold font-headline">HealthHub</h1>
        </div>
        <div className="absolute bottom-8 left-8 text-white">
            <div className="max-w-xl">
                <blockquote className="text-3xl font-semibold italic">
                    "The future of healthcare is in our hands, connected by technology that cares."
                </blockquote>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6 p-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access the full dashboard.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
