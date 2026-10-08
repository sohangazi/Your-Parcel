import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
import {
  BookOpen,
  Search,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const { blogPosts } = useData();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Only published posts for public view
  const publishedPosts = blogPosts.filter((p) => p.status === 'published');

  const categories = ['All', ...Array.from(new Set(publishedPosts.map((p) => p.category)))];

  const filteredPosts = publishedPosts.filter((post) => {
    const matchesCat = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {selectedPost ? (
          /* Single Post Detail View */
          <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shipping Guides</span>
            </button>

            {/* Post Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedPost.publishedAt || selectedPost.createdAt).toLocaleDateString('en-US', {
                    dateStyle: 'medium',
                  })}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedPost.author}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {selectedPost.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {selectedPost.description}
              </p>
            </div>

            {/* Featured Image */}
            {selectedPost.featuredImage && (
              <div className="rounded-3xl overflow-hidden border border-slate-800 aspect-video max-h-[460px] w-full bg-slate-900">
                <img
                  src={selectedPost.featuredImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
              {selectedPost.content}
            </div>

            {/* SEO & Meta info */}
            {selectedPost.keywords && (
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Keywords: {selectedPost.keywords}</span>
              </div>
            )}

            {/* Related Posts */}
            <div className="pt-10 border-t border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-white">More Logistics & Customs Guides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {publishedPosts
                  .filter((p) => p.id !== selectedPost.id)
                  .slice(0, 2)
                  .map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedPost(rel)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-colors group"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {rel.category}
                      </span>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors mt-1 line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  ))}
              </div>
            </div>
          </article>
        ) : (
          /* Blog Listing */
          <div className="space-y-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Logistics Insights & Regulations</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                International Shipping Guides
              </h1>
              <p className="text-sm sm:text-base text-slate-400">
                Master customs protocols, volumetric packaging techniques, and airline requirements before you ship.
              </p>

              {/* Filters & Search */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search articles & rules..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === cat
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {post.featuredImage && (
                      <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-cyan-500/30">
                          {post.category}
                        </span>
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            dateStyle: 'medium',
                          })}
                        </span>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-amber-300 transition-colors">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
