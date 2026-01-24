"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaImage, FaSpinner } from 'react-icons/fa';
import { htmlToText } from 'html-to-text';

// --- Toolbar Component ---
const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) return null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image too large (Max 5MB).");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        editor.chain().focus().setImage({ src: data.secure_url }).run();
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-slate-200 bg-slate-50">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><FaBold /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><FaItalic /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><FaStrikethrough /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><FaListUl /></button>
      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="relative">
        {isUploading ? <FaSpinner className="animate-spin" /> : <FaImage />}
      </button>
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
      <style jsx>{`
        button { font-weight: bold; padding: 6px; border-radius: 4px; border: 1px solid #ccc; background-color: #fff; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; }
        button.is-active { background-color: #3b82f6; color: white; border-color: #3b82f6; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

// --- Main Editor Component ---
interface EditorProps {
  content: string;
  onChange: (data: { html: string; readTime: number }) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: EditorProps) => {
  const editor = useEditor({
    extensions: [ StarterKit, Image ],
    immediatelyRender: false,
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = htmlToText(html, { wordwrap: 130 });
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const readTime = Math.ceil(wordCount / 200);

      onChange({ html, readTime });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose max-w-none m-5 focus:outline-none min-h-[150px]',
      },
    },
  });

  // FIX: Updated useEffect
  useEffect(() => {
    // Only update content if it's actually different to avoid loops
    if (editor && content && editor.getHTML() !== content) {
      // Removed the 'false' argument to satisfy TypeScript
      editor.commands.setContent(content); 
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default RichTextEditor;