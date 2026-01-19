import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    provider?: string;
    providerAccountId?: string;
  }
}
