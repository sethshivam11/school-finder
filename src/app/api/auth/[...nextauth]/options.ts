import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import { mail, mailText } from "@/lib/mail";

export interface UserI {
  id: number;
  fullName: string;
  email: string;
  password: string;
  code: number | null;
  codeExpiry: Date | null;
  isVerified: boolean;
  createdAt: Date;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      fullName: string;
      isVerified: boolean;
    };
  }
  interface User {
    id: number;
    email: string;
    fullName: string;
    isVerified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const db = await connectDB();

        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials");
          }

          const [rows] = await db.execute(
            `SELECT * FROM users WHERE email = ?`,
            [credentials.email]
          );
          const user = (rows as UserI[])[0];

          if (!user) {
            throw new Error("Invalid email");
          }

          if (!user.isVerified) {
            const code = Math.floor(
              100_000 + Math.random() * 900_000
            ).toString();
            const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

            await db.execute(
              `UPDATE users SET isVerified = 1, code = ?, codeExpiry = ? WHERE email = ?`,
              [code, codeExpiry, credentials.email]
            );

            await sendEmail({
              to: credentials.email,
              subject: "Verify your email",
              text: mailText(code),
              html: mail(code),
            });

            throw new Error("User is not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password || "",
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          return user as unknown as User;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An error occurred");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.fullName = token.fullName as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/sign-up",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
