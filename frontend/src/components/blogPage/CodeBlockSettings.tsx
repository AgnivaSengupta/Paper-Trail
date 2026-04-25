import { Editor } from '@tiptap/react'

export const CodeBlockSettings = ({ editor }: { editor: Editor }) => {
  // Only show if the current selection is a codeBlock
  if (!editor.isActive('codeBlock')) return null

  const attrs = editor.getAttributes('codeBlock')

  const updateAttributes = (newAttrs: Record<string, any>) => {
    editor.chain().focus().updateAttributes('codeBlock', newAttrs).run()
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-800 border rounded-lg shadow-xl shadow-black/20">
      {/* Language Selector */}
      <select 
        value={attrs.language || 'text'}
        onChange={(e) => updateAttributes({ language: e.target.value })}
        className="bg-accent text-xs font-mono border-none outline-none focus:ring-0 cursor-pointer rounded-md"
      >
        <option value="javascript">JS</option>
        <option value="typescript">TS</option>
        <option value="python">Python</option>
        <option value="go">Go</option>
        <option value="C">C</option>
        {/*<option value="python">C++</option>*/}
        <option value="css">CSS</option>
        <option value="text">Plain Text</option>
      </select>

      <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-600" />

      {/* Filename Input */}
      <input
        type="text"
        placeholder="filename.js"
        value={attrs.filename || ''}
        onChange={(e) => updateAttributes({ filename: e.target.value })}
        className="bg-transparent text-xs font-mono border-none outline-none focus:ring-0 w-32"
      />
    </div>
  )
}