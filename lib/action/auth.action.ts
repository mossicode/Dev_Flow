"use server";

import { createHash } from "crypto";
import mongoose from "mongoose";
import { AuthCredentials } from "../../types/action";
import { ActionResponse, ErrorResponse } from "../../types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validation";
import { SignInSchema } from "../validation";
import User from "../../database/user.model";
import bcrypt from "bcryptjs";
import Account from "../../database/account.model";
import { signIn } from "../../auth";
import { AuthError } from "next-auth";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const getEmailAvatar = (email: string) => {
    const hash = createHash("md5").update(email).digest("hex");
    return `https://www.gravatar.com/avatar/${hash}?s=200&d=404`;
};
const resolveEmailAvatar = async (email: string): Promise<string> => {
    const avatarUrl = getEmailAvatar(email);

    try {
        const response = await fetch(avatarUrl, { method: "GET", cache: "no-store" });
        return response.ok ? avatarUrl : "";
    } catch {
        return "";
    }
};

function mapAuthError(error: unknown): ErrorResponse | null {
    if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin") {
            return {
                success: false,
                status: 401,
                error: { message: "Invalid email or password" },
            };
        }

        return {
            success: false,
            status: 401,
            error: { message: "Authentication failed. Please try again." },
        };
    }

    return null;
}

export async function signUPWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
    try {
        const validationResult = await action({ params, schema: SignUpSchema });
        const validatedParams = validationResult.params;
        if (!validatedParams) {
            throw new Error("Invalid signup payload");
        }

        const { name, username, email, password } = validatedParams;
        const normalizedEmail = normalizeEmail(email);
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const existingUser = await User.findOne({ email: normalizedEmail }).session(session);
            if (existingUser) {
                throw new Error("User already exists");
            }

            const existingUsername = await User.findOne({ username }).session(session);
            if (existingUsername) {
                throw new Error("Username already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const avatar = await resolveEmailAvatar(normalizedEmail);

            const [newUser] = await User.create(
                [
                    {
                        username,
                        name,
                        email: normalizedEmail,
                        image: avatar,
                    },
                ],
                { session }
            );

            await Account.create(
                [
                    {
                        userId: newUser._id,
                        name,
                        provider: "credentials",
                        providerAccountId: normalizedEmail,
                        password: hashedPassword,
                    },
                ],
                { session }
            );

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }

        await signIn("credentials", { email: normalizedEmail, password, redirect: false });
        return { success: true };
    } catch (error) {
        const authError = mapAuthError(error);
        if (authError) return authError;

        return handleError(error) as ErrorResponse;
    }
}

export async function signInWithCredentials(
    params: Pick<AuthCredentials, 'email' | 'password'>): Promise<ActionResponse> {
    try {
        const validationResult = await action({ params, schema: SignInSchema });
        const validatedParams = validationResult.params;
        if (!validatedParams) {
            throw new Error("Invalid signin payload");
        }

        const { email, password } = validatedParams;
        const normalizedEmail = normalizeEmail(email);
        await signIn("credentials", { email: normalizedEmail, password, redirect: false });

        return { success: true };
    } catch (error) {
        const authError = mapAuthError(error);
        if (authError) return authError;

        return handleError(error) as ErrorResponse;
    }
}
