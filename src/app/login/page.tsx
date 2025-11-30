import Image from "next/image";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(
    (img) => img.id === "login-background-2"
  );

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden h-full w-full bg-gray-900 text-white lg:block">
        <Image
          src={loginBg?.imageUrl || "/placeholder.svg"}
          alt={loginBg?.description || "Login background image"}
          data-ai-hint={loginBg?.imageHint}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Stethoscope className="h-8 w-8" />
          <h1 className="text-xl font-semibold text-white">HealthHub Rural</h1>
        </div>
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <Link href="#" className="text-sm font-medium text-white hover:underline">
            Admin
          </Link>
          <ThemeToggle />
        </div>
        <div className="absolute bottom-8 left-8">
            <div className="max-w-md">
                <blockquote className="text-lg italic">
                    "This platform has revolutionized how we manage patient care in our rural facility, bringing efficiency and accuracy to the forefront."
                </blockquote>
                <p className="mt-4 text-sm font-semibold">- Dr. Priya Sharma</p>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6 p-8 rounded-lg bg-card shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
