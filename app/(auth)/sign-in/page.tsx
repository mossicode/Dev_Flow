"use client"
import AuthForm from "../../../components/forms/AuthForm";
import { signInWithCredentials } from "../../../lib/action/auth.action";
import { SignInSchema } from "../../../lib/validation";

export default function SignIn() {
  return (
    <div className="flex justify-center items-center text-white">
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={signInWithCredentials}
      />
    </div>
  );
}
