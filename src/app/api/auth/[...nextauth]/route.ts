import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { generateAndStoreRefreshToken } from "@/lib/utils/generateTokens";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/mongoose";
import { generateOAuthPassword } from "@/lib/utils/generateOAuthPassword";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt", // internal only
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      await connectDB();

      // 1️⃣ Find or create user
      let dbUser = await User.findOne({ email: user.email });
      if (!dbUser) {
        const password = generateOAuthPassword(account.providerAccountId);
        dbUser = await User.create({
          email: user.email,
          username: user.name ?? user?.email?.split("@")[0],
          role: "member",
          password,
        });
      }

      // 2️⃣ Issue BACKEND refresh token
      const { refreshToken } = await generateAndStoreRefreshToken(dbUser);

      // 3️⃣ Set backend cookie
      const cookieStore = await cookies();

      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return true;
    },
  },
});

export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { generateOAuthPassword } from "@/lib/utils/generateOAuthPassword";
// import { syncGoogleUser } from "@/lib/socialBackendAuth";

// const handler = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   session: { strategy: "jwt" },

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         const password = generateOAuthPassword(account.providerAccountId);

//         await syncGoogleUser({
//           email: user.email!,
//           fullName: user.name || "Google User",
//           password,
//         });
//       }
//       return true;
//     },

//     async jwt({ token, account }) {
//       // Persist provider info in token
//       if (account) {
//         token.provider = account.provider;
//         token.providerAccountId = account.providerAccountId;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub!;
//         session.user.provider = token.provider;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };
