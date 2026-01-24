"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor"; // Import the Tiptap component

// --- Types & Constants ---
interface Post {
  _id: string;
  title: { mn: string; en: string; ko: string };
  excerpt: { mn: string; en: string; ko: string };
  content: { mn: string; en: string; ko: string };
  author: string;
  date: string;
  image: string;
  readTime: { mn: string; en: string; ko: string }; // Changed to string
}

const BLANK_POST = {
  title: { mn: "", en: "", ko: "" },
  excerpt: { mn: "", en: "", ko: "" },
  content: { mn: "", en: "", ko: "" },
  author: "Admin",
  date: new Date().toISOString().split("T")[0],
  image: "",
  readTime: { mn: "1 min", en: "1 min", ko: "1분" }, // Default read time
};

export default function BlogsManager({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Partial<Post>>(BLANK_POST);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(BLANK_POST);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setFormData(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // --- HANDLERS ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image too large (Max 5MB).");

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      if (json.secure_url) setFormData(prev => ({ ...prev, image: json.secure_url }));
    } catch (err) { alert("Image upload failed"); } 
    finally { setUploadingImage(false); }
  };

  const handleTrilingualChange = (field: 'title' | 'excerpt', lang: 'mn' | 'en' | 'ko', value: string) => {
    setFormData(prev => ({ ...prev, [field]: { ...(prev[field] as any), [lang]: value } }));
  };
  
  // ✅ UPDATED: Handle object from RichTextEditor
  const handleContentChange = (lang: 'mn' | 'en' | 'ko', data: { html: string; readTime: number }) => {
    const readTimeText = lang === 'ko' ? `${data.readTime}분` : `${data.readTime} min`;
    setFormData(prev => ({ 
      ...prev, 
      content: { ...(prev.content as any), [lang]: data.html },
      readTime: { ...(prev.readTime as any), [lang]: readTimeText }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingPost ? "PATCH" : "POST";
    const body = editingPost ? { ...formData, _id: editingPost._id } : formData;

    try {
      await fetch("/api/admin/blogs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      handleCloseModal();
      router.refresh(); 
    } catch (err) { alert("An error occurred."); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch("/api/admin/blogs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id }) });
      setPosts(prev => prev.filter(p => p._id !== _id));
      router.refresh();
    } catch (err) { alert("An error occurred."); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Blog Posts</h1>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700">
          <FaPlus /> Write New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4">Title (EN)</th>
              <th className="p-4">Author</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{post.title.en}</td>
                <td className="p-4 text-slate-600">{post.author}</td>
                <td className="p-4 text-slate-600">{post.date}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleOpenEdit(post)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingPost ? "Edit Post" : "Create New Post"}</h2>
                <button onClick={handleCloseModal}><FaTimes /></button>
              </div>
              <form id="blogForm" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                
                <TrilingualInput label="Title" field="title" value={formData.title} onChange={handleTrilingualChange} />
                <TrilingualInput label="Excerpt (Short Summary)" field="excerpt" value={formData.excerpt} onChange={handleTrilingualChange} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Author" value={formData.author} onChange={v => setFormData({...formData, author: v})} />
                    <Input type="date" label="Date" value={formData.date} onChange={v => setFormData({...formData, date: v})} />
                    
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Image</label>
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-slate-50">
                            {uploadingImage ? "Uploading..." : formData.image ? <img src={formData.image} className="h-20" /> : <FaCloudUploadAlt />}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <RichTextEditor content={formData.content?.mn || ''} onChange={data => handleContentChange('mn', data)} placeholder="Монгол агуулга..." />
                        <RichTextEditor content={formData.content?.en || ''} onChange={data => handleContentChange('en', data)} placeholder="English content..." />
                        <RichTextEditor content={formData.content?.ko || ''} onChange={data => handleContentChange('ko', data)} placeholder="한국어 콘텐츠..." />
                    </div>
                </div>

              </form>
              <div className="p-6 border-t mt-auto flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button>
                <button type="submit" form="blogForm" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Post"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
const TrilingualInput = ({ label, field, value, onChange }: any) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={value?.mn || ''} onChange={(e) => onChange(field, 'mn', e.target.value)} placeholder="MN" className="w-full border p-2 rounded" />
            <input value={value?.en || ''} onChange={(e) => onChange(field, 'en', e.target.value)} placeholder="EN" className="w-full border p-2 rounded" />
            <input value={value?.ko || ''} onChange={(e) => onChange(field, 'ko', e.target.value)} placeholder="KO" className="w-full border p-2 rounded" />
        </div>
    </div>
);

const Input = ({ label, value, onChange, type = "text" }: { label: string; value: string | undefined; onChange: (value: string) => void; type?: string; }) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <input 
            type={type} 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            className="w-full border p-2 rounded" 
        />
    </div>
);