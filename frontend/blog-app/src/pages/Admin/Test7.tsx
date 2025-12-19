import React, { useState, useCallback } from 'react';
import { 
  // Layout Icons
  LayoutDashboard, FileText, MessageSquare, PanelLeft, PanelLeftClose, 
  Sun, Moon, ChevronLeft, Settings, Plus, X, UploadCloud,
  // Editor Icons
  Bold, Italic, Strikethrough, Code, Quote, List, ListOrdered, 
  Heading1, Heading2, Image as ImageIcon, Link as LinkIcon, Undo, Redo, 
  Save, Send, Eye, Hash
} from 'lucide-react';

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlock from '@tiptap/extension-code-block';
import Sidebar from '@/components/dashboard/Sidebar';

// --- Utility Components ---

const SidebarItem = ({ icon: Icon, label, active, collapsed }) => (
  <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 mb-1 cursor-pointer rounded-lg transition-colors ${active ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'}`} title={collapsed ? label : ''}>
    <div className="flex items-center gap-3">
      <Icon size={18} />
      {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </div>
  </div>
);

const TagInput = ({ tags, onAddTag, onRemoveTag }) => {
  const [input, setInput] = useState('');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAddTag(input.trim());
      setInput('');
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            <Hash size={10} className="opacity-50" /> {tag}
            <button onClick={() => onRemoveTag(tag)} className="hover:text-rose-500 ml-1"><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add tags..." className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" />
        <Plus size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
};

const ImageUploadBox = ({ image, onUpload, onRemove }) => (
  <div className="relative group w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 overflow-hidden">
    {image ? (
      <>
        <img src={image} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={onRemove} className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"><X size={16} /></button>
        </div>
      </>
    ) : (
      <div className="text-center p-4">
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400"><UploadCloud size={20} /></div>
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Click to upload cover</p>
      </div>
    )}
    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) onUpload(URL.createObjectURL(e.target.files[0])); }} />
  </div>
);

// --- Tiptap Menu Bar ---

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const Btn = ({ onClick, isActive, icon: Icon, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white' 
          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
      }`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
      <div className="flex items-center gap-0.5 border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-1">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strike" />
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} icon={Code} title="Inline Code" />
      </div>

      <div className="flex items-center gap-0.5 border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-1">
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="H1" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="H2" />
      </div>

      <div className="flex items-center gap-0.5 border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-1">
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Ordered List" />
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Quote" />
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Hash} title="Code Block" />
      </div>

      <div className="flex items-center gap-0.5 border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-1">
        <Btn onClick={addImage} isActive={false} icon={ImageIcon} title="Image" />
        <Btn onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Link" />
      </div>

      <div className="flex items-center gap-0.5 ml-auto">
        <Btn onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={Undo} title="Undo" />
        <Btn onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={Redo} title="Redo" />
      </div>
    </div>
  );
};

// --- Main Page Component ---

const Test7 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Meta Form State
  const [meta, setMeta] = useState({
    title: '',
    slug: '',
    coverImage: null,
    tags: ['Technology'],
    category: 'Engineering',
    excerpt: ''
  });

  // Tiptap Editor Configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // The StarterKit already includes formatting for Bold, Italic, Headings, CodeBlock, etc.
        // It also handles Markdown Shortcuts (e.g. # for H1, > for quote)
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: `
      <h1>Hello World</h1>
      <p>Start writing your amazing story here...</p>
      <pre><code>console.log('Hello from Tiptap!');</code></pre>
    `,
    editorProps: {
      attributes: {
        // Tailwind Typography classes (prose) applied here
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
  });

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0f1014] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
        
        {/* --- Navigation Sidebar --- */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

        {/* --- Main Workspace --- */}
        <div className={`flex flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          
          {/* Left: Editor Canvas */}
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            
            {/* Top Header */}
            <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center px-8 bg-white dark:bg-[#0f1014]">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-medium rounded border border-amber-200 dark:border-amber-500/20">Draft</span>
                <span className="text-zinc-400 text-sm">Last saved just now</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Eye size={16} /> Preview
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Save size={16} /> Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/20 transition-colors">
                  <Send size={16} /> Publish
                </button>
              </div>
            </header>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0f1014] scroll-smooth">
              <div className="max-w-4xl mx-auto pb-20 mt-6 bg-white dark:bg-[#0f1014]">
                {/* Tiptap Menu Bar */}
                <MenuBar editor={editor} />
                
                {/* The Editor Content */}
                <EditorContent editor={editor} className="tiptap-editor-container" />
              </div>
            </div>
          </main>

          {/* Right: Metadata Form */}
          <aside className="w-[350px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1014] flex flex-col h-screen overflow-y-auto hide-scrollbar z-40">
            <div className="p-6">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Settings size={16} /> Post Settings
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Blog Title</label>
                  <input type="text" value={meta.title} onChange={(e) => setMeta({...meta, title: e.target.value})} placeholder="Enter title..." className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Cover Image</label>
                  <ImageUploadBox image={meta.coverImage} onUpload={(url) => setMeta({...meta, coverImage: url})} onRemove={() => setMeta({...meta, coverImage: null})} />
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Category</label>
                    <select value={meta.category} onChange={(e) => setMeta({...meta, category: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100">
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Tutorial</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Tags</label>
                    <TagInput tags={meta.tags} onAddTag={(t) => setMeta({...meta, tags: [...meta.tags, t]})} onRemoveTag={(t) => setMeta({...meta, tags: meta.tags.filter(tag => tag !== t)})} />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">SEO Excerpt</label>
                  <textarea rows={4} value={meta.excerpt} onChange={(e) => setMeta({...meta, excerpt: e.target.value})} placeholder="Description..." className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-zinc-100 resize-none" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Global Styles for Tiptap specific tweaks */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .dark .ProseMirror p.is-editor-empty:first-child::before {
          color: #52525b;
        }
        /* Custom Code Block Styling */
        .ProseMirror pre {
          background: #27272a;
          color: #f8f9fa;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
        }
        .dark .ProseMirror pre {
           background: #18181b;
           border: 1px solid #27272a;
        }
        /* Ensure image in editor is responsive */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        /* Focused Image Styling */
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #10b981;
        }
      `}</style>
    </div>
  );
};

export default Test7;