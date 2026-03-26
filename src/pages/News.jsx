import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import mo ito para sa navigation
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import NewsCard from "@/components/ui/NewsCard";
import { supabase } from "@/lib/supabase"; 

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate(); // Hook para sa pag-lipat ng page

  const categories = ["All", "Community", "Corporate", "Tips"];

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching news:", error.message);
      } else {
        setNewsList(data || []);
      }
      setLoading(false);
    }

    fetchNews();
  }, []);

  const filteredNews = filter === "All" 
    ? newsList 
    : newsList.filter(item => item.category === filter);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           {/* Simple loading spinner */}
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-bold text-slate-400">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <PageHeader 
        title="News & Updates" 
        subtitle="Stay informed with the latest stories from Angelica Life Plan." 
      />

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        
        {/* 1. Category Filter Bar */}
        <Reveal direction="bottom">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                  ? "bg-brand-primary text-white shadow-md scale-105" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* 2. Featured Story (Latest Post - visible only on 'All') */}
        {filter === "All" && filteredNews.length > 0 && (
          <Reveal direction="left">
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row mb-16 group">
              <div className="lg:w-1/2 overflow-hidden aspect-video lg:aspect-auto">
                <img 
                  src={filteredNews[0].image_url} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt="Featured" 
                />
              </div>
              <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Latest Update
                  </span>
                  <span className="text-slate-400 text-xs font-medium">{filteredNews[0].date}</span>
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-brand-secondary transition-colors">
                  {filteredNews[0].title}
                </h2>
                <p className="text-slate-600 mb-6 line-clamp-3">
                  {filteredNews[0].content}
                </p>
                
                <button 
                  onClick={() => navigate(`/news/${filteredNews[0].id}`)}
                  className="w-fit text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all"
                >
                  Read Full Story <span>→</span>
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* 3. News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news, index) => (
            <Reveal key={news.id} direction="bottom" delay={index * 0.1}>
              <NewsCard news={news} />
            </Reveal>
          ))}
        </div>

        {/* 4. Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-40">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-slate-400 font-medium">No news articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}