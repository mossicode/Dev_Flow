import mongoose from "mongoose";
import { auth } from "../../../../../auth";
import { QuesitonForm } from "../../../../../components/forms/question-form";
import { notFound, redirect } from "next/navigation";
import { RouteParams } from "../../../../../types/global";
import { getQuestion } from "../../../../../lib/action/question.action";
import ROUTES from "../../../../../constants/Route";
import User from "../../../../../database/user.model";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function resolveSessionUserId(sessionUserId?: string, sessionEmail?: string | null) {
  if (sessionUserId && mongoose.isValidObjectId(sessionUserId)) {
    return sessionUserId;
  }

  if (sessionEmail) {
    const user = await User.findOne({ email: normalizeEmail(sessionEmail) }).select("_id");
    if (user?._id) return user._id.toString();
  }

  return null;
}

async function Page({ params }: RouteParams) {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success || !question) return notFound();

  const currentUserId = await resolveSessionUserId(session.user?.id, session.user?.email);
  const authorId = typeof question.author === "string" ? question.author : question.author?._id?.toString();

  if (!currentUserId || !authorId || authorId !== currentUserId) {
    redirect(ROUTES.QUESTION(id));
  }

  return (
    <div>
      <QuesitonForm question={question} isEdit />
    </div>
  );
}

export default Page;
