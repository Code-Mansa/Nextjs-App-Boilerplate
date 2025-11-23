"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/dashboard";

  const { register, isRegistering, isRegisterError } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email, password });
      router.push(redirectTo); // redirect to dashboard or intended page
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <Card className='w-96 p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Sign Up</h1>

        {isRegisterError && (
          <p className='text-sm text-red-600'>
            Registration failed. Try again.
          </p>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete='new-username'
            name='signup-username'
          />

          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='new-email'
            name='signup-email'
          />

          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='new-password'
            name='signup-password'
          />

          <p className='text-sm'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='hover:underline font-semibold text-indigo-700'>
              Login
            </Link>
          </p>

          <Button type='submit' className='w-full' disabled={isRegistering}>
            {isRegistering ? "signing in..." : "Sign Up"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
