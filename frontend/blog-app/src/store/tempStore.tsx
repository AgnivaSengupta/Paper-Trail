import { create } from 'zustand'

interface EditorState {
  html: string
  json: any
  setContent: (html: string, json: any) => void
}

const useEditorStore = create<EditorState>((set) => ({
  html: '',
  json: null,
  setContent: (html, json) => set({ html, json }),
}))

export default useEditorStore
