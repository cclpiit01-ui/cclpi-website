import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setArticle(data);
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading full story...</div>;
  if (!article) return <div className="text-center py-20">Article not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/news/news" className="text-blue-600 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all">
          ← Back to News
        </Link>
        
        <img src={article.image_url} className="w-full h-[300px] md:h-[500px] object-cover rounded-3xl mb-10 shadow-lg" alt={article.title} />
        
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-slate-400 text-sm">Published {article.date}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-slate-500 font-bold mb-10 italic">By {article.author || 'Admin'}</p>

        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>
    </div>
  );
}