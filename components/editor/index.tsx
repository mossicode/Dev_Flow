'use client'

import "@mdxeditor/editor/style.css"
import "./dark-editor.css"

import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
} from "@mdxeditor/editor"
import { cn } from "../../lib/utils"

interface Props {
  value: string
  fieldChange: (value: string) => void
  editorRef?: React.Ref<MDXEditorMethods>
}

export default function Editor({
  value,
  fieldChange,
  editorRef,
  ...props
}: Props & Omit<MDXEditorProps, "markdown" | "onChange" | "ref">) {
  const { className, ...restProps } = props

  return (
    <MDXEditor
      markdown={value}
      onChange={fieldChange}
      className={cn("markdown-editor border rounded-lg min-h-44", className)}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({
          defaultCodeBlockLanguage: "txt",
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            txt: "Text",
            js: "JavaScript",
            ts: "TypeScript",
            jsx: "JSX",
            tsx: "TSX",
            html: "HTML",
            css: "CSS",
            scss: "SCSS",
            bash: "Bash",
            sql: "SQL",
          },
          autoLoadLanguageSupport: true,
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CreateLink />
                      <InsertImage />
                      <Separator />
                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      ref={editorRef}
      {...restProps}
    />
  )
}
