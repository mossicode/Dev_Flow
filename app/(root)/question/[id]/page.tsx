import { RouteParams } from "../../../../types/global"
async function QuestionDetails({params}:RouteParams) {
    const {id}= await params
  return (
    <div>
        {id}
    </div>
  )
}

export default QuestionDetails