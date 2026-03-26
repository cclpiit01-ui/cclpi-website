import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/animation/Reveal";
import NewsCard from "@/components/ui/NewsCard";
import { ArrowRight, Newspaper } from 'lucide-react';

export default function HomeNews() {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error) {
        setLatestNews(data);
      }
      setLoading(false);
    }
    fetchLatest();
  }, []);

  if (!loading && latestNews.length === 0) return null;

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-surface rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-slate-100 pb-10">
          <Reveal direction="left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-[2px] bg-brand-accent" />
                <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[20px] font-sans">
                  The Angelica Post
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-brand-primary font-heading leading-tight">
                LATEST <span className="text-brand-secondary italic font-light font-serif">Stories</span>
              </h2>
              <p className="text-slate-400 font-medium text-sm max-w-md">
                Keep up with our recent activities, travel incentives, and community announcements.
              </p>
            </div>
          </Reveal>
          
          <Reveal direction="right">
            <Link 
              to="/news"
              className="group relative flex items-center gap-3 bg-brand-surface hover:bg-brand-primary px-8 py-4 rounded-full transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 font-black text-brand-primary group-hover:text-white font-sans text-[11px] tracking-[0.2em] uppercase">
                Browse Archive
              </span>
              <ArrowRight className="relative z-10 text-brand-secondary group-hover:translate-x-1 transition-transform" size={18} />
              
              {/* Button Hover Slide Effect */}
              <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </Reveal>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-slate-50 animate-pulse rounded-[2rem]" />
                <div className="h-4 w-2/3 bg-slate-50 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-50 animate-pulse rounded" />
              </div>
            ))
          ) : (
            latestNews.map((news, index) => (
              <Reveal key={news.id} direction="bottom" delay={index * 0.1}>
                <div className="group">
                  <NewsCard news={news} />
                  {/* Extra branding under the card */}
                  <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                    <Newspaper size={14} className="text-brand-secondary" />
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                      Press Release • {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}