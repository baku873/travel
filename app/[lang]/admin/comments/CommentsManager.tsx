"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCheck, FaTimes, FaCommentDots, FaGlobeAsia, FaStar, FaEdit, FaSave, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

// --- Types ---
interface Comment {
  _id: string;
  name: string;
  trip: string;
  text: string;
  location: string;
  rating: number;
  language: 'mn' | 'en' | 'ko';
  status: 'approved' | 'pending' | 'rejected';
  dateStr: string;
}

// Initial state for new comment form
const INITIAL_FORM = {
  name: "",
  trip: "",
  text: "",
  location: "",
  rating: 5,
  language: "mn" as 'mn' | 'en' | 'ko',
  status: "approved" as 'approved'
};

export default function CommentsManager({ initialComments }: { initialComments: Comment[] }) {
  const router = useRouter();
  
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  
  // --- Inline Editing State ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // --- Create Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState(INITIAL_FORM);

  // --- Handlers ---

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewComment(INITIAL_FORM); // Reset form
        router.refresh(); // Refresh server data
        // Optimistic update (optional, but good for UX)
        alert("Comment added successfully! Refreshing...");
        window.location.reload(); 
      } else {
        alert("Failed to create comment.");
      }
    } catch (err) {
      alert("Error creating comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, status: newStatus }),
      });
      // Optimistic Update
      setComments(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      router.refresh();
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await fetch(`/api/admin/comments?id=${id}`, {
        method: "DELETE",
      });
      setComments(prev => prev.filter(c => c._id !== id));
      router.refresh();
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = async (id: string) => {
    try {
      await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, text: editText }),
      });
      setComments(prev => prev.map(c => c._id === id ? { ...c, text: editText } : c));
      setEditingId(null);
    } catch (err) {
      alert("Failed to save edit.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <FaCommentDots className="text-blue-500" /> Comments Manager
            </h1>
            <div className="flex gap-2 text-sm font-bold text-slate-500 mt-2">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">Approved: {comments.filter(c => c.status === 'approved').length}</span>
                <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">Pending: {comments.filter(c => c.status === 'pending').length}</span>
            </div>
        </div>
        
        {/* New Button to Open Modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition active:scale-95"
        >
          <FaPlus /> Add Manual Review
        </button>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Review Content</th>
              <th className="p-4">Trip & Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comments.map((comment) => (
              <tr key={comment._id} className="hover:bg-slate-50 transition-colors">
                
                {/* User Info */}
                <td className="p-4 align-top w-48">
                    <div className="font-bold text-slate-800">{comment.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <FaGlobeAsia /> {comment.language.toUpperCase()} • {comment.location}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{comment.dateStr}</div>
                </td>

                {/* Content (Editable) */}
                <td className="p-4 align-top">
                    {editingId === comment._id ? (
                        <div className="space-y-2">
                            <textarea 
                                value={editText} 
                                onChange={(e) => setEditText(e.target.value)} 
                                className="w-full border p-2 rounded text-sm min-h-[80px] focus:ring-2 focus:ring-blue-200 outline-none"
                            />
                            <div className="flex gap-2">
                                <button onClick={() => saveEdit(comment._id)} className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"><FaSave /> Save</button>
                                <button onClick={cancelEdit} className="px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded hover:bg-slate-300">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-600 text-sm italic relative group cursor-pointer" onClick={() => startEditing(comment)}>
                            "{comment.text}"
                            <span className="hidden group-hover:inline-block ml-2 text-blue-400"><FaEdit /></span>
                        </p>
                    )}
                </td>

                {/* Trip & Rating */}
                <td className="p-4 align-top w-40">
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1 inline-block">
                        {comment.trip}
                    </div>
                    <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < comment.rating ? "text-yellow-400" : "text-slate-200"} />
                        ))}
                    </div>
                </td>

                {/* Status Badge */}
                <td className="p-4 align-top w-32">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        comment.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        comment.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {comment.status}
                    </span>
                </td>

                {/* Actions */}
                <td className="p-4 align-top text-right w-40">
                    <div className="flex justify-end gap-2">
                        {comment.status !== 'approved' && (
                            <button 
                                onClick={() => handleStatusChange(comment._id, 'approved')} 
                                disabled={loading}
                                className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 tooltip" 
                                title="Approve"
                            >
                                <FaCheck />
                            </button>
                        )}
                        
                        {comment.status !== 'rejected' && (
                             <button 
                                onClick={() => handleStatusChange(comment._id, 'rejected')} 
                                disabled={loading}
                                className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 tooltip"
                                title="Reject (Hide)"
                             >
                                <FaTimes />
                            </button>
                        )}

                        <button 
                            onClick={() => handleDelete(comment._id)} 
                            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 tooltip"
                            title="Delete Permanently"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>

              </tr>
            ))}
            {comments.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        No comments found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Create Comment Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }} 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Add Manual Review</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                
                {/* Language Select */}
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Language</label>
                   <div className="flex gap-2">
                      {['mn', 'en', 'ko'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setNewComment({...newComment, language: lang as any})}
                          className={`flex-1 py-2 text-sm font-bold rounded border ${
                            newComment.language === lang 
                              ? 'bg-blue-50 border-blue-500 text-blue-600' 
                              : 'bg-white border-slate-200 text-slate-500'
                          }`}
                        >
                           {lang.toUpperCase()}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">User Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            value={newComment.name}
                            onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            value={newComment.location}
                            onChange={(e) => setNewComment({...newComment, location: e.target.value})}
                            placeholder="e.g. Paris, France"
                        />
                    </div>
                </div>

                {/* Trip & Rating */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trip Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            value={newComment.trip}
                            onChange={(e) => setNewComment({...newComment, trip: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rating</label>
                        <select 
                            className="w-full border p-2 rounded text-sm bg-white"
                            value={newComment.rating}
                            onChange={(e) => setNewComment({...newComment, rating: Number(e.target.value)})}
                        >
                           <option value={5}>5 Stars</option>
                           <option value={4}>4 Stars</option>
                           <option value={3}>3 Stars</option>
                           <option value={2}>2 Stars</option>
                           <option value={1}>1 Star</option>
                        </select>
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Review Content</label>
                    <textarea 
                        required
                        rows={4}
                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        value={newComment.text}
                        onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                    />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  {loading ? "Posting..." : "Post Review"}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}