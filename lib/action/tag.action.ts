import type {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question as QuestionType,
  Tag as TagType,
} from "../../types/global";
import { Question, Tag } from "../../database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetTagQuestionSchema, PaginatedSearchParamsSchema } from "../validation";
import type { GetTagQuestionParams } from "../../types/action";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: TagType[]; isNext: boolean }>> => {
  try {
    const validationResult = await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });

    const { page = 1, pageSize = 10, filter, query } = validationResult.params ?? params;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const filterQuery: Record<string, unknown> = {};
    if (query) {
      filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
    }

    let sortCriteria: Record<string, 1 | -1>;
    switch (filter) {
      case "popular":
        sortCriteria = { question: -1 };
        break;
      case "recent":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "name":
        sortCriteria = { name: 1 };
        break;
      default:
        sortCriteria = { question: -1 };
        break;
    }

    const totalTags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);
    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTagQuestion = async (
  params: GetTagQuestionParams
): Promise<ActionResponse<{ tag: TagType; questions: QuestionType[]; isNext: boolean }>> => {
  try {
    const validationResult = await action({
      params,
      schema: GetTagQuestionSchema,
    });

    const { tagId, page = 1, pageSize = 10, query } = validationResult.params ?? params;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const tag = await Tag.findById(tagId);
    if (!tag) {
      throw new Error("Tag not Found");
    }

    const filterQuery: Record<string, unknown> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }

    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .skip(skip)
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
