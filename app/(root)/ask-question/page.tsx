import { QuesitonForm } from "../../../components/forms/question-form";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="max-sm:px-3">
      <h1 className="max-sm:mb-3 mb-4 text-lg max-sm:text-base">Ask Question</h1>
      <QuesitonForm />
    </div>
  );
}

export default Page;
