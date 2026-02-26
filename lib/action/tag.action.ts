import type { ActionResponse, ErrorResponse, PaginatedSearchParams, Tag as TagType } from "../../types/global";
import TagModel from "../../database/tag.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validation";

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

    let sortCriteria: Record<string, 1 | -1> = {};
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

    const totalTags = await TagModel.countDocuments(filterQuery);
    const tags = await TagModel.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);
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
