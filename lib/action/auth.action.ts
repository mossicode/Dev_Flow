"use server";

import mongoose from "mongoose";
import { AuthCredentials, SignInCredentials } from "../../types/action";
import { ActionResponse, ErrorResponse } from "../../types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validation";
import { SignInSchema } from "../validation";
import User from "../../database/user.model";
import bcrypt from "bcryptjs";
import Account from "../../database/account.model";
import { signIn } from "../../auth";

export async function signUPWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
    try {
        const validationResult = await action({ params, schema: SignUpSchema });
        const validatedParams = validationResult.params;
        if (!validatedParams) {
            throw new Error("Invalid signup payload");
        }

        const { name, username, email, password } = validatedParams;
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const existingUser = await User.findOne({ email }).session(session);
            if (existingUser) {
                throw new Error("User already exists");
            }

            const existingUsername = await User.findOne({ username }).session(session);
            if (existingUsername) {
                throw new Error("Username already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const [newUser] = await User.create(
                [
                    {
                        username,
                        name,
                        email,
                        image: "https://placehold.co/200x200",
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
                        providerAccountId: email,
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

        await signIn("credentials", { email, password, redirect: false });
        return { success: true };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function signInWithCredentials(params: SignInCredentials): Promise<ActionResponse> {
    try {
        const validationResult = await action({ params, schema: SignInSchema });
        const validatedParams = validationResult.params;
        if (!validatedParams) {
            throw new Error("Invalid signin payload");
        }

        const { email, password } = validatedParams;
        await signIn("credentials", { email, password, redirect: false });

        return { success: true };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
