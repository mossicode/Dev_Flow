"use client";

import AuthForm from "../../../components/forms/AuthForm";
import { signUPWithCredentials } from "../../../lib/action/auth.action";
import { SignUpSchema } from "../../../lib/validation";

export default function SignUp() {
  return (
    <div className="flex justify-center items-center text-white">
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{
          name: "",
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={signUPWithCredentials}
      />
    </div>
  );
}
