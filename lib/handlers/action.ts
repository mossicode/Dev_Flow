'use server'

import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "../../auth";
import { connectDB } from "../mongodb";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

type ActionReturn<T> = {
  params?: T;
  session?: Session | null;
};

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>): Promise<ActionReturn<T>> {
  let validatedParams = params;

  if (schema && params !== undefined) {
    try {
      validatedParams = schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      }
      throw new Error("Schema validation failed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();
    if (!session) {
      throw new UnauthorizedError(401, "Unauthorized");
    }
  }

  await connectDB();

  return { params: validatedParams, session };
}

export default action;
