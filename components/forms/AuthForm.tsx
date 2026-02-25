  "use client";

  import { zodResolver } from "@hookform/resolvers/zod";
  import { DefaultValues, FieldValues, Resolver, SubmitHandler, useForm } from "react-hook-form";
  import { ZodType } from "zod";
  import { useRouter } from "next/navigation";

  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../ui/form";

  import { Input } from "../ui/input";
  import { Button } from "../ui/button";
  import { ActionResponse } from "../../types/global";

  interface AuthFormProps<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<ActionResponse>;
    formType: "SIGN_IN" | "SIGN_UP";
  }

  function AuthForm<T extends FieldValues>({
    schema,
    formType,
    defaultValues,
    onSubmit,
  }: AuthFormProps<T>) {
    const router = useRouter();

    const form = useForm<T>({
      resolver: zodResolver(schema) as Resolver<T>,
      defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
      const result = await onSubmit(data) as ActionResponse;
      if (result?.success) {
        form.reset();
        router.push("/");
        router.refresh();
        return;
      }

      form.setError("root", {
        message: result?.error?.message ?? "Something went wrong. Please try again.",
      });
    };

    const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 px-5 w-full max-w-lg"
        >
          {/* Name Field */}
          {"name" in defaultValues && (
            <FormField
              control={form.control}
              name={"name" as any}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          )}

          {/* Username Field */}
          {"username" in defaultValues && (
            <FormField
              control={form.control}
              name={"username" as any}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          )}

          {/* Email Field */}
          {"email" in defaultValues && (
            <FormField
              control={form.control}
              name={"email" as any}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          )}

          {/* Password Field */}
          {"password" in defaultValues && (
            <FormField
              control={form.control}
              name={"password" as any}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          )}
          {form.formState.errors.root?.message && (
            <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
          )}
          <div className="text-end">
            
          <Button
            type="submit"
            className="hover:bg-orange-400 text-white bg-orange-500 w-30 transition"
          >
            {buttonText}
          </Button>
          </div>
        </form>
      </Form>
    );
  }

  export default AuthForm;
