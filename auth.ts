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

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const email = credentials?.email as string | undefined;
                const password = credentials?.password as string | undefined;
                if (!email || !password) return null;
                const normalizedEmail = normalizeEmail(email);

                let account = await Account.findOne({
                    provider: "credentials",
                    providerAccountId: normalizedEmail,
                });

                if (!account) {
                    account = await Account.findOne({
                        provider: "credentials",
                        providerAccountId: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
                    });
                }
                if (!account?.password) return null;

                const isPasswordValid = await bcrypt.compare(password, account.password);
                if (!isPasswordValid) return null;

                const user = await User.findById(account.userId);
                if (!user) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
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
