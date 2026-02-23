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
})