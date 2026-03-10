import z from "zod";

export const AskQuestionSchema=z.object({
    title:z
        .string()
        .min(5, {message:"title is required"})
        .max(100, {message:"title shoud be lesss than 100"}),
    content:z
        .string()
        .min(1,{message:"body is required"}),
    tags:z
    .array(
        z
        .string()
        .min(1,{message:'taq is required'})
        .max(30, {message:"tag shoud not be more than 30"})
    )
    .min(1,{message:"at least one taq is required"})
    .max(3, {message:"cannot add more than 3 tags"})

})
export const SignInSchema=z.object({
    email:z
    .string()
    .min(4, {message:"Email must be more than 4"})
    .email({message:"please provide a proper email."}),
    password:z
    .string()
    .min(4, {message:"password must be more than 4 character."})
    .max(15, {message:"password must be less than 15 character."})
})
export const SignUpSchema=z.object({
    name:z
    .string()
    .min(4, {message:"Name must be more than 4"})
    .max(15, {message:"Name must be less than 15 character. "}),
    username:z
    .string()
    .min(4, {message:"userName must be more than 4"})
    .max(15, {message:"userName must be less than 15 character. "}),
    email:z
    .string()
    .min(4, {message:"Email must be more than 4"})
    .email({message:"please provide a proper email."}),
    password:z
    .string()
    .min(4, {message:"password must be more than 4 character."})
    .max(15, {message:"password must be less than 15 character."})
})
export const UserSchema=z.object({
    name:z.string().min(1,{message:"Name must be more that one character"}),
    username:z.string().min(3,{message:"username must be more than 3 character"}),
    email:z.string().email({message:"please provide a proper email . "}),
    bio:z.string().optional(),
    image:z.string().url({message:"Please provide a vaild URL."}).optional(),
    location:z.string().optional(),
    portfolio:z.string().url({message:"Please provide a valid URL."}).optional(),
    reputation:z.number().optional()
})
export const AccountSchema = z.object({
  userId: z
    .string()
    .min(10, { message: "شناسه کاربر نامعتبر است (ObjectId باید 24 کاراکتر باشد)" }),
  
  name: z
    .string()
    .min(1, { message: "نام کاربر نمی‌تواند خالی باشد" }),
  
  image: z
    .string()
    .url({ message: "لطفاً یک URL معتبر برای تصویر وارد کنید" })
    .optional(),
  
  password: z
    .string()
    .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
    .optional(),
  
  provider: z
    .string()
    .min(1, { message: "لطفاً یک provider معتبر وارد کنید" }),
  
  providerAccountId: z
    .string()
    .min(1, { message: "شناسه حساب provider نمی‌تواند خالی باشد" }),
});
export const SignInWithOAuthSchema= z.object({
  provider:z.enum(["google", "github"]),
  providerAccountId:z.
    string()
    .min(1, {message:"Provider Account Id is required."}),
    user:z.object({
      name:z.string().min(1, {message:"Name is required"}),
      username:z.string().min(3, {message:"username must be more than 3 characters"}),
      email:z.string().email({message:"please provide a proper email."}),
      image:z.string().url("invalid url").optional()
    })
})
export const PaginatedSearchParamsSchema= z.object({
  page:z.number().int().positive().default(1),
  pageSize:z.number().int().positive().default(10),
  query:z.string().optional(),
  filter:z.string().optional(),
  sort:z.string().optional(),
});


export const GetTagQuestionSchema=PaginatedSearchParamsSchema.extend({
  tagId:z.string().min(1, {message:"atleast one character must have?"})
})

export const IncrementViewsSchema=z.object({
  questionId:z.string().min(1, {message:"Question ID is required"})
})

export const AnswerSchema=z.object({
  content:z.string()
  .min(20, {message:"Answer has to have more than 20 characters. "})
})
export const AnswerQuestionSchema=AnswerSchema.extend({
  questionId:z.string().min(1, {message:"Question ID is required"})
})
export const GetAnswerQuestionSchema=PaginatedSearchParamsSchema.extend({
  questionId:z.string().min(1, {message:"Question ID is required"})
})
export const AIAnswerSchema=z.object({
  question:z.string().min(5, {message:"Question must be more than 5 character"}).max(100, {message:"Question must be less than 100 characters"}),
  content:z.string().min(20,{message:"Answer must be more than characters. "})
})
export const CreateVoteSchema=z.object({
  targetId:z.string().min(1, {message:"Target ID is required"}),
  targetType:z.enum(['question', "answer"], {message:"Invalid target Type"}),
  voteType:z.enum(["upvote", "downvote"], {message:"Invalid vote type"})
})
export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z
    .number()
    .int()
    .refine((value) => value === 1 || value === -1, { message: "Invalid change value" }),
})
export const HasVoteSchema=CreateVoteSchema.pick({
  targetId:true,
  targetType:true
})

export const CollectionBaseSchema=z.object({
  questionId:z.string().min(1, {message:"Question ID is required. "})
})
export const GetUserSchema=z.object({
  userId:z.string().min(1, {message:"User ID is required"})
})
export const GetUserQuestionSchema=PaginatedSearchParamsSchema.extend({
  userId:z.string().min(1, {message:"User ID is required"}),
})
export const GetUserAnswersSchema=PaginatedSearchParamsSchema.extend({
  userId:z.string().min(1, {message:"User ID is required"}),
})
export const GetUserTagSchema=z.object({
  userId:z.string().min(1, {message:"User ID is required. "})
})

export const DeleteQuestionSchema=z.object({
  questionId:z.string().min(1, {message:"User ID is required. "})
})
export const DeleteAnswerSchema=z.object({
  answerId:z.string().min(1, {message:"Answer ID is required. "})
})
