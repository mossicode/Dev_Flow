import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import { connectDB } from "../../../../lib/mongodb";
import handleError from "../../../../lib/handlers/error";
import { APIErrorResponse } from "../../../../types/global";
import { SignInWithOAuthSchema } from "../../../../lib/validation";
import { ValidationError } from "../../../../lib/http-errors";

import User from "../../../../database/user.model";
import Account from "../../../../database/account.model";

export async function POST(request: Request) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    const { provider, providerAccountId, user } = body;

    // ✅ Validate Data
    const validateData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validateData.success) {
      throw new ValidationError(
        validateData.error.flatten().fieldErrors
      );
    }

    const { name, username, email, image } = user;

    // ✅ Slugify Username
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // ✅ Check if user exists
    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      // 🔥 Create new user
      [existingUser] = await User.create(
        [
          {
            name,
            username,
            slugifiedUsername,
            email,
            image,
          },
        ],
        { session }
      );
    } else {
      // 🔄 Update name/image if changed
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    // ✅ Check if account exists
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id, // ⚠️ Correct key
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    // ✅ Commit transaction
    await session.commitTransaction();

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}