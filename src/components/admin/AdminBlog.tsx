import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Sparkles,
  Calendar,
  Globe,
  Tag,
} from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const { blogPosts, saveBlogPost, deleteBlogPost } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Guides');
  const [author, setAuthor] = useState('YOUR PARCEL Logistics Team');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setFeaturedImage(
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
    );
    setDescription('');
    setContent('');
    setCategory('Guides');
    setAuthor('YOUR PARCEL Operations Desk');
    setStatus('published');
    setSeoTitle('');
    setSeoDescription('');
    setKeywords('');
    setModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setFeaturedImage(post.featuredImage);
    setDescription(post.description);
    setContent(post.content);
    setCategory(post.category);
    setAuthor(post.author);
    setStatus(post.status);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setKeywords(post.keywords || '');
    setModalOpen(true);
  };

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingPost ? editingPost.id : `post-${Date.now()}`;

    const payload: BlogPost = {
      id,
      title,
      slug: slug || generateSlug(title),
      featuredImage,
      description,
      content,
      category,
      author,
      status,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || description,
      keywords,
      publishedAt: editingPost?.publishedAt || new Date().toISOString(),
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveBlogPost(payload);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Shipping Guides & Blog CMS</h1>
          <p className="text-xs text-slate-400">
            Publish educational articles on international customs, packaging protocols, and trade news.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-6">Article Title</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Author</th>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {blogPosts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-850/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-white max-w-sm line-clamp-1">{post.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{post.slug}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-400 font-mono text-[10px]">
                    {post.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-400">{post.author}</td>
                <td className="py-4 px-6 text-slate-400">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      post.status === 'published'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete post "${post.title}"?`)) {
                        deleteBlogPost(post.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-950 text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg">{editingPost ? 'Edit Article' : 'Write Shipping Guide'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Guide to Sending Passports & University Certificates"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Featured Image URL</label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Short Description / Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Rich Markdown Content *</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write full article body here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="published">Published (Live on Public Website)</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Publish Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
