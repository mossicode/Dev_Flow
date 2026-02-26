import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";
import Account from "./database/account.model";
import User from "./database/user.model";
import { connectDB } from "./lib/mongodb";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Protect production deployments from accidental localhost Auth.js base URL.
if (process.env.NODE_ENV === "production" && process.env.VERCEL_URL) {
    const vercelAuthUrl = `https://${process.env.VERCEL_URL}`;
    if (!process.env.AUTH_URL || process.env.AUTH_URL.includes("localhost")) {
        process.env.AUTH_URL = vercelAuthUrl;
    }
    if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
        process.env.NEXTAUTH_URL = vercelAuthUrl;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        GitHub,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    const email = credentials?.email as string | undefined;
                    const password = credentials?.password as string | undefined;
                    if (!email || !password) return null;
                    const normalizedEmail = normalizeEmail(email);

                    let account = await Account.findOne({
                        provider: { $regex: "^credentials$", $options: "i" },
                        providerAccountId: normalizedEmail,
                    });

                    if (!account) {
                        account = await Account.findOne({
                            provider: { $regex: "^credentials$", $options: "i" },
                            providerAccountId: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
                        });
                    }

                    // Fallback for legacy records where providerAccountId was not normalized.
                    if (!account) {
                        const existingUser = await User.findOne({
                            email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
                        });
                        if (existingUser) {
                            account = await Account.findOne({
                                userId: existingUser._id,
                                provider: { $regex: "^credentials$", $options: "i" },
                            });
                        }
                    }

                    if (!account?.password) return null;

                    const isBcryptHash = account.password.startsWith("$2a$") || account.password.startsWith("$2b$") || account.password.startsWith("$2y$");
                    let isPasswordValid = false;

                    if (isBcryptHash) {
                        isPasswordValid = await bcrypt.compare(password, account.password);
                    } else {
                        isPasswordValid = account.password === password;
                        if (isPasswordValid) {
                            account.password = await bcrypt.hash(password, 12);
                            await account.save();
                        }
                    }

                    if (!isPasswordValid) return null;

                    const user = await User.findById(account.userId);
                    if (!user) return null;

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                const { data: existingAccount, success } = (await api.accounts.getByProvider(
                    account.type === "credentials"
                        ? token.email!
                        : account.providerAccountId
                )) as ActionResponse<IAccountDoc>;

                if (!success || !existingAccount) return token;

                const userId = existingAccount.userId;
                if (userId) token.sub = userId.toString();
            }
            return token;
        },
        async signIn({ user, profile, account }) {
            if (account?.type === "credentials") return true;
            if (!account || !user || !user.email) return false;

            const userinfo = {
                name: user.name,
                email: user.email,
                image: user.image,
                username:
                    account.provider === "github"
                        ? (profile?.login as string)
                        : (user.name?.toLocaleLowerCase() as string),
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userinfo,
                provider: account.provider as "github" | "google",
                providerAccountId: account.providerAccountId as string,
            })) as ActionResponse;

            return !!success;
        },
    },
});
