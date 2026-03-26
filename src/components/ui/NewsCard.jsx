import { useNavigate } from 'react-router-dom';

export default function NewsCard({ news }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/news/${news.id}`)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={news.image_url} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={news.title}
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
            {news.category}
          </span>
          <span className="text-slate-400 text-[10px] font-medium italic">By {news.author || 'Admin'}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-brand-secondary transition-colors">
          {news.title}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-6">
          {news.content}
        </p>
        
        {/* Heto yung "Read More" na lalabas sa LAHAT ng cards */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">{news.date}</span>
          <span className="text-brand-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
}