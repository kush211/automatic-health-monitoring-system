import Image from "next/image";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(
    (img) => img.id === "login-background"
  );

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden bg-muted lg:block">
        <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10 text-white">
            <div className="flex items-center gap-2">
                <Stethoscope className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold font-headline">HealthHub Rural</h1>
            </div>
            <Link href="#" className="text-sm font-medium hover:underline">Admin</Link>
        </header>
        <Image
          src={loginBg?.imageUrl || "/placeholder.svg"}
          alt={loginBg?.description || "Login background image"}
          data-ai-hint={loginBg?.imageHint}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="max-w-md">
                <blockquote className="text-lg italic font-medium">
                    "This platform has revolutionized how we manage patient care in our rural facility, bringing efficiency and accuracy to the forefront."
                </blockquote>
                <p className="mt-4 font-semibold">— Dr. Priya Sharma</p>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 bg-background">
        <div className="mx-auto grid w-[400px] gap-6 p-8 rounded-lg bg-card shadow-lg">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Doctor Access</h1>
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
