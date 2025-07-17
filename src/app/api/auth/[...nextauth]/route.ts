import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "E-posta ile Giriş",
      credentials: {
        email: { label: "E-posta", type: "email", placeholder: "mail@site.com" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials, req) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials?.email });
        if (user && user.password) {
          const isValid = await compare(credentials!.password, user.password);
          if (isValid) {
            return {
              id: user._id.toString(),
              name: user.name, // user.username yerine user.name
              email: user.email
            };
          }
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/giris",
    signOut: "/giris",
    error: "/giris"
  },
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      // İlk girişte user varsa token'a name ekle
      if (user) {
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      // token'daki name'i session.user.name olarak ata
      if (token?.name) {
        session.user.name = token.name;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 