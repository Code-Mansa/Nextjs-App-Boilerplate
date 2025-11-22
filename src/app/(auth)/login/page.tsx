"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // Now safe
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // useAuth already redirects on success
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-96 p-8'>
        <h1 className='text-2xl font-bold mb-6'>Login</h1>
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
          <Button type='submit' className='w-full' disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
