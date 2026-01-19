"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push(redirectTo); // ✅ redirect to intended page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-96 p-8'>
        <h1 className='text-2xl font-bold mb-2'>Login</h1>
        {loginError && (
          <div className='bg-red-100 text-red-600 p-3 rounded-lg text-sm'>
            {loginError}
          </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className='text-sm'>
            Don&apos;t have an account?{" "}
            <Link
              href='/signup'
              className='hover:underline font-semibold text-indigo-700'>
              Signup
            </Link>
          </p>

          <Button type='submit' className='w-full' disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Button
          type='button'
          variant='outline'
          className='w-full py-4 rounded-full mt-6'
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}
