"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
        <p className="text-white text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6">
      <Card className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl border border-white/30 p-6">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center shadow-md">
              <span className="text-4xl font-bold text-blue-700">A</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-white">Welcome to Polling App</CardTitle>
          <CardDescription className="text-white/80">
            Sign in to participate in polls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-white/80 text-center">
            By continuing, you agree to our <span className="font-semibold">Terms of Service</span> and <span className="font-semibold">Privacy Policy</span>.
          </p>
          <Button
            className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-white/70 text-sm">Need help? <a href="#" className="underline">Contact Support</a></p>
        </CardFooter>
      </Card>
    </div>
  );
}
