import { QuesitonForm } from "../../../components/forms/question-form";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Ask Question</h1>
      <QuesitonForm />
    </div>
  );
}

export default Page;
