// "use client"
import { Code } from "bright"
import { MDXRemote } from "next-mdx-remote/rsc"

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
}

type PreviewProps = {
  content?: string
}

function Preview({ content = "" }: PreviewProps) {
  const formattedContent = content
    .replace(/\\/g, "")
    .replace(/&#x20/g, "")

  return (
    <section className="markdown prose grid break-word">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props: any) => (
            <Code
              {...props}
              lineNumbers
              className="text-blue-500"
            />
          ),
        }}
      />
    </section>
  )
}

export default Preview