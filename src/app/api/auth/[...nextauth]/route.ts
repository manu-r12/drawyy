import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { saveUser } from "../../../../services/userService";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
              if (user && account?.provider === 'google') {
                const data = {
                    uid: user.id,
                    name: user.name ?? "Unknown",
                    email: user.email ?? "",
                    drawings: [],
                    collab_drawings: []
                }
                
                await saveUser(data)
              }
              return true; // Allow sign in
            } catch (error) {
              console.error('Error in signIn callback:', error);
              return true;
            }
          },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id ?? "";
                token.name = user.name ?? "Unknown User";
                token.email = user.email ?? "";
                token.image = user.image ?? "";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
