import Link from "next/link";

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <div className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 py-32 px-16 bg-white dark:bg-black'>
        <h1 className='text-xl font-semibold'>Welcome To Quba Next App</h1>

        <ul className='text-sm text-muted-foreground space-y-1 text-center'>
          <li>• Full authentication system</li>
          <li>• Shadcn UI + rich components</li>
          <li>• Dark mode built-in</li>
          <li>• React Query integrated</li>
          <li>• Utility helpers included</li>
        </ul>

        <Link
          href='/login'
          className='bg-muted rounded-xl px-4 py-2 hover:opacity-80 transition'>
          Login
        </Link>
      </div>
    </div>
  );
}
