"use server"
import mongoose from "mongoose";
import type { ActionResponse, ErrorResponse, PaginatedSearchParams, Question as QuestionType } from "../../types/global";
import handleError from "../handlers/error";
import { AskQuestionSchema, DeleteQuestionSchema, IncrementViewsSchema, PaginatedSearchParamsSchema } from "../validation";
import Tag from "../../database/tag.model";
import TagQuestion from "../../database/tag-question.model";
import User from "../../database/user.model";
import action from "../handlers/action";
import Question from "../../database/question.medel";
import { DeleteQuestionParams, IncrementViewParams } from "../../types/action";
import { connectDB } from "../mongodb";
import { Answer, Collection, Vote } from "../../database";
import { revalidatePath } from "next/cache";
import ROUTES from "../../constants/Route";

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId?: string;
  quesitionId?: string;
}
interface QuestionMutationResult {
  _id: string;
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

async function upsertTagsWithLinks(
  tags: string[],
  questionId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession
) {
  const tagIds: mongoose.Types.ObjectId[] = [];
  const tagQuestionDocuments: Array<{ tag: mongoose.Types.ObjectId; question: mongoose.Types.ObjectId }> = [];

  for (const rawTag of tags) {
    const normalizedTag = rawTag.trim().toLowerCase();
    const safeTag = escapeRegex(normalizedTag);

    const existingTag = await Tag.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${safeTag}$`, "i") } },
      { $setOnInsert: { name: normalizedTag }, $inc: { question: 1 } },
      { upsert: true, new: true, session }
    );

    if (!existingTag) {
      throw new Error(`Failed to upsert tag: ${normalizedTag}`);
    }

    tagIds.push(existingTag._id);
    tagQuestionDocuments.push({ tag: existingTag._id, question: questionId });
  }

  if (tagQuestionDocuments.length > 0) {
    await TagQuestion.insertMany(tagQuestionDocuments, { session });
  }

  return tagIds;
}

export async function getQuestion(params: GetQuestionParams): Promise<ActionResponse<QuestionType>> {
  try {
    await action({});

    const questionId = params.questionId ?? params.quesitionId;

    if (!questionId || !mongoose.isValidObjectId(questionId)) {
      throw new Error("Invalid question id");
    }

    const question = await Question.findById(questionId)
      .populate({ path: "tags", select: "name" })
      .populate({ path: "author", select: "name image" })
      .lean();

    if (!question) {
      throw new Error("Question not found");
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<QuestionMutationResult>> {
  let session: mongoose.ClientSession | null = null;

  try {
    const validationResult = await action({
      params,
      schema: AskQuestionSchema,
      authorize: true,
    });

    const { title, content, tags } = validationResult.params as CreateQuestionParams;
    const authorId = await resolveSessionUserId(
      validationResult.session?.user?.id,
      validationResult.session?.user?.email
    );

    if (!authorId) {
      throw new Error("Unauthorized");
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const [question] = await Question.create([{ title, content, author: authorId }], { session });

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds = await upsertTagsWithLinks(tags, question._id, session);

    if (tagIds.length > 0) {
      await Question.findByIdAndUpdate(question._id, { $addToSet: { tags: { $each: tagIds } } }, { session });
    }

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<QuestionMutationResult>> {
  let session: mongoose.ClientSession | null = null;

  try {
    const { questionId, ...questionData } = params;

    if (!questionId || !mongoose.isValidObjectId(questionId)) {
      throw new Error("Invalid question id");
    }

    const validationResult = await action({
      params: questionData,
      schema: AskQuestionSchema,
      authorize: true,
    });

    const { title, content, tags } = validationResult.params as CreateQuestionParams;
    const authorId = await resolveSessionUserId(
      validationResult.session?.user?.id,
      validationResult.session?.user?.email
    );

    if (!authorId) {
      throw new Error("Unauthorized");
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const existingQuestion = await Question.findById(questionId).session(session);
    if (!existingQuestion) {
      throw new Error("Question not found");
    }

    if (existingQuestion.author?.toString() !== authorId) {
      throw new Error("You are not allowed to edit this question");
    }

    const oldTagIds = (existingQuestion.tags || []).map((tagId: mongoose.Types.ObjectId) => tagId.toString());

    if (oldTagIds.length > 0) {
      await Tag.updateMany({ _id: { $in: oldTagIds } }, { $inc: { question: -1 } }, { session });
      await TagQuestion.deleteMany({ question: existingQuestion._id }, { session });
    }

    const newTagIds = await upsertTagsWithLinks(tags, existingQuestion._id, session);

    existingQuestion.title = title;
    existingQuestion.content = content;
    existingQuestion.tags = newTagIds;
    await existingQuestion.save({ session });

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(existingQuestion)) };
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ question: QuestionType[]; isNext: boolean }>> {
  try {
    await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });

    const { page = 1, pageSize = 10, query, filter } = params;
    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const filterquery: Record<string, unknown> = {};

    if (filter === "recommended") {
      return { success: true, data: { question: [], isNext: false } };
    }

    if (query) {
      filterquery.$or = [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ];
    }

    const sortFilters = new Set(["newest", "unanswered", "popular", "recommended"]);
    if (filter && !sortFilters.has(filter)) {
      const tag = await Tag.findOne({ name: { $regex: new RegExp(`^${escapeRegex(filter)}$`, "i") } }).select("_id");
      if (!tag?._id) {
        return { success: true, data: { question: [], isNext: false } };
      }
      filterquery.tags = tag._id;
    }

    let sortCriteria: Record<string, 1 | -1> = {};
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterquery.answers = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const totalQuestion = await Question.countDocuments(filterquery);
    const questions = await Question.find(filterquery)
      .populate("tags", "name")
      .populate("author", "id name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestion > skip + questions.length;

    return {
      success: true,
      data: { question: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementView(
  params:IncrementViewParams
):Promise<ActionResponse<{views:number}>>{
  try {
    const validationResult=await action({
      params,
      schema:IncrementViewsSchema
    })
    const {questionId}=validationResult.params as IncrementViewParams;
    const question=await Question.findById(questionId);
    if(!question){
      throw new Error("Question not Found")
    }
    question.views+=1;
    await question.save();
    // revalidatePath(ROUTES.QUESTION(questionId))
    return {
      success:true,
      data:{views:question.views}
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function getHotQuestions():Promise<ActionResponse<QuestionType[]>>{
  try {
    await connectDB();
    const questions=await Question.find()
      .sort({views:-1, upvotes:-1})
      .limit(5);
      return {
        success:true,
        data:JSON.parse(JSON.stringify(questions))
      }
    
  } catch (error) {
    return handleError(error) as ErrorResponse; 
  }
}
export async function deleteQuestionById(params: DeleteQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({
      params,
      authorize: true,
      schema: DeleteQuestionSchema
    });

    const { questionId } = validationResult.params as DeleteQuestionParams;
    const userId = validationResult.session?.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const question = await Question.findById(questionId).session(session);
        if (!question) {
          throw new Error("Question not Found");
        }

        if (question.author?.toString() !== userId) {
          throw new Error("You are not allowed to delete this question");
        }

        const answerIds = (await Answer.find({ question: questionId }).select("_id").session(session)).map(
          (answer) => answer._id
        );
        const tagIds = (question.tags || []).map((tagId: mongoose.Types.ObjectId) => tagId.toString());

        if (tagIds.length > 0) {
          await Tag.updateMany({ _id: { $in: tagIds } }, { $inc: { question: -1 } }, { session });
        }

        if (answerIds.length > 0) {
          await Vote.deleteMany({ id: { $in: answerIds }, type: "answer" }).session(session);
        }

        await Vote.deleteMany({ id: question._id, type: "question" }).session(session);
        await Answer.deleteMany({ question: questionId }).session(session);
        await Collection.deleteMany({ question: questionId }).session(session);
        await TagQuestion.deleteMany({ question: questionId }).session(session);
        await Question.findByIdAndDelete(questionId).session(session);

        await session.commitTransaction();
        revalidatePath(ROUTES.HOME);
        revalidatePath(ROUTES.QUESTION(questionId));
        revalidatePath(ROUTES.PROFILE(userId));
        return { success: true };
    } catch (error) {
      await session.abortTransaction();
      return handleError(error) as ErrorResponse;
    } finally {
      await session.endSession();
    }
}
