"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-[#151515] rounded-t-xl">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('code') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1 self-center" />

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Heading 2"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Heading 3"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1 self-center" />

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1 self-center" />

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-lg text-text-muted hover:bg-white/5 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-lg text-text-muted hover:bg-white/5 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-orange max-w-none focus:outline-none min-h-[300px] p-4 bg-[#111111] rounded-b-xl text-white placeholder:text-white/20',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes (like when loading initial data)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-white/10 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-inner">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
