import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { CustomPrismaAdapter } from "@/lib/auth-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";
import { isAdminEmail, sendAdminVerificationEmail } from "@/lib/admin-verification";

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_client_secret",
      profile(profile) {
        const DEFAULT_AVATAR =
          "https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg";
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture || DEFAULT_AVATAR,
          role: "user",
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        
        if (!parsedCredentials.success) {
          throw new Error("Invalid input format");
        }

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        if (isAdminEmail(user.email) && user.role === "admin" && !user.emailVerified) {
          await sendAdminVerificationEmail(user.email);
          throw new Error("ADMIN_EMAIL_VERIFICATION_REQUIRED");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatarUrl,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        const currentUser = session.user.email
          ? await prisma.user.findUnique({
              where: { email: session.user.email },
              select: { role: true, emailVerified: true },
            })
          : null;

        if (currentUser?.role === "admin") {
          session.user.role =
            isAdminEmail(session.user.email || "") && currentUser.emailVerified ? "admin" : "user";
        } else {
          session.user.role = currentUser?.role || "user";
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "placeholder_nextauth_secret_key",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
