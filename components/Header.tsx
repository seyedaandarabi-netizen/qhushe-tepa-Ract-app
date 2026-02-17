
import React, { useState, useEffect, useRef } from 'react';
import { User, Language, Notification, AppDocument, DocStatus } from '../types';
import { translations } from '../translations';

interface Props {
  user: User;
  lang: Language;
  setLang: (l: Language) => void;
  docs: AppDocument[];
  notifications: Notification[];
  onClearNotifications: () => void;
}

const Header: React.FC<Props> = ({ user, lang, setLang, docs, notifications, onClearNotifications }) => {
  const t = translations[lang];
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedDoc, setTrackedDoc] = useState<AppDocument | null>(null);
  const [searchResult, setSearchResult] = useState<AppDocument | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('qt_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse search history");
      }
    }
  }, []);

  // Handle clicking outside history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('qt_recent_searches', JSON.stringify(newHistory));
  };

  const performSearch = (query: string) => {
    const doc = docs.find(d => 
      d.docNumber.toLowerCase().includes(query.toLowerCase()) || 
      d.id === query ||
      d.title.toLowerCase().includes(query.toLowerCase())
    );

    if (doc) {
      setSearchResult(doc);
      addToHistory(query);
      const timer = setTimeout(() => setSearchResult(null), 10000);
      return () => clearTimeout(timer);
    } else {
      alert(lang === 'ps' ? "سند ونه موندل شو" : "سند پیدا نشد");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(searchQuery);
    setShowHistory(false);
  };

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
    setShowHistory(false);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('qt_recent_searches');
  };

  const toggleTheme = (theme: string) => {
    document.body.setAttribute('data-theme', theme);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[#141118]/50 backdrop-blur-md border-b border-white/5 z-40 shrink-0 relative">
      {/* Search Result Toast/Notification */}
      {searchResult && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] animate-in slide-in-from-top-8 fade-in duration-500">
          <div className="glass-dark p-5 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20">
              <span className="material-symbols-outlined text-2xl">find_in_page</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-black text-sm truncate pr-2">{searchResult.title}</h4>
                <button 
                  onClick={() => setSearchResult(null)}
                  className="material-symbols-outlined text-white/20 hover:text-white transition-colors text-lg"
                >
                  close
                </button>
              </div>
              <p className="text-[10px] text-purple-400 font-mono mt-0.5">{searchResult.docNumber}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${searchResult.status === DocStatus.Approved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {searchResult.status}
                </span>
                <button 
                  onClick={() => {
                    setTrackedDoc(searchResult);
                    setSearchResult(null);
                  }}
                  className="text-[10px] font-black text-purple-400 hover:text-purple-300 underline underline-offset-4"
                >
                  {lang === 'ps' ? "بشپړ جزئیات" : "مشاهده جزئیات کامل"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-lg font-bold text-white tracking-tight hidden md:block">{t.title}</h2>
        
        <div className="flex-1 max-w-md relative" ref={historyRef}>
          <form onSubmit={handleSearch} className="relative group">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xl group-focus-within:text-purple-400 transition-colors">search</span>
            <input 
              type="text" 
              placeholder={lang === 'ps' ? "د سند شمېره وپلټئ..." : "رهگیری سند با شماره..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-purple-600/50 outline-none transition-all placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
            />
          </form>

          {/* Recent Searches Dropdown */}
          {showHistory && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-2xl border border-white/10 shadow-2xl py-3 overflow-hidden animate-in slide-in-from-top-2 z-50">
              <div className="px-4 py-1 flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{lang === 'ps' ? "وروستي لټونونه" : "جستجوهای اخیر"}</span>
                <button 
                  onClick={clearHistory}
                  className="text-[9px] text-red-400/60 hover:text-red-400 font-bold uppercase tracking-tighter"
                >
                  {lang === 'ps' ? "پاکول" : "پاک کردن"}
                </button>
              </div>
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryItemClick(query)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 text-left transition-colors group"
                >
                  <span className="material-symbols-outlined text-sm text-white/20 group-hover:text-purple-400">history</span>
                  <span className="text-[11px] text-white/60 group-hover:text-white truncate">{query}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 px-6 border-r border-white/5">
          <button onClick={() => toggleTheme('default')} className="size-5 rounded-full bg-purple-600 border border-white/20 hover:scale-125 transition-all shadow-lg shadow-purple-600/20"></button>
          <button onClick={() => toggleTheme('emerald')} className="size-5 rounded-full bg-emerald-500 border border-white/20 hover:scale-125 transition-all shadow-lg shadow-emerald-500/20"></button>
          <button onClick={() => toggleTheme('frost')} className="size-5 rounded-full bg-blue-400 border border-white/20 hover:scale-125 transition-all shadow-lg shadow-blue-400/20"></button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          {(['dr', 'ps', 'fa'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === l ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-white/40 hover:text-white'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border border-white/5 hover:bg-white/5 transition-all relative ${unreadCount > 0 ? 'text-purple-400' : 'text-white/40'}`}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#141118]">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full left-0 mt-4 w-80 glass-dark rounded-[2rem] border border-white/10 shadow-2xl p-6 animate-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-bold text-sm">{t.notifications}</h4>
                <button onClick={onClearNotifications} className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-widest">Clear All</button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-center text-white/20 text-[10px] py-4">هیچ اعلان جدیدی وجود ندارد</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[11px] font-bold text-white">{n.title}</p>
                      <p className="text-[10px] text-white/40 mt-1">{n.message}</p>
                      <span className="text-[9px] text-purple-400/50 mt-2 block font-mono">{n.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 pr-6 border-r border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-white">{user.fullName}</span>
            <span className="text-[10px] text-purple-400/70 font-bold tracking-widest">{user.role}</span>
          </div>
          <div className="size-11 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 p-0.5 shadow-xl shadow-purple-600/20">
            <img className="w-full h-full object-cover rounded-[14px]" src={`https://picsum.photos/seed/${user.username}/100/100`} alt="Avatar" />
          </div>
        </div>
      </div>

      {trackedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-dark w-full max-w-lg rounded-[2.5rem] p-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white">{lang === 'ps' ? "د سند پلټنه" : "رهگیری و جزئیات سند"}</h3>
              <button onClick={() => setTrackedDoc(null)} className="material-symbols-outlined text-white/40 hover:text-white transition-colors">close</button>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-white">{trackedDoc.title}</h4>
                  <p className="text-[10px] text-purple-400 font-mono mt-1">{trackedDoc.docNumber}</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase border ${trackedDoc.status === DocStatus.Approved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {trackedDoc.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">موقعیت فعلی</p>
                  <p className="text-xs font-bold text-white">{trackedDoc.branch}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">تاریخ ثبت</p>
                  <p className="text-xs font-bold text-white">{trackedDoc.date}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-black text-white/40 uppercase tracking-widest px-2">مسیر جابجایی (Timeline)</h5>
                <div className="space-y-3 relative before:absolute before:right-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/5">
                  {trackedDoc.history?.map((h, i) => (
                    <div key={i} className="relative pr-10 group">
                      <div className="absolute right-2.5 top-1.5 size-3.5 rounded-full border-4 border-[#0f0a1a] bg-purple-600 shadow-[0_0_10px_rgba(127,19,236,0.5)]" />
                      <div className="p-4 glass rounded-2xl border-white/5 group-hover:bg-white/5 transition-all">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-white">{h.action}</span>
                          <span className="text-[9px] text-purple-400 font-bold">{h.timestamp}</span>
                        </div>
                        <p className="text-[9px] text-white/30">{h.from} ← {h.to}</p>
                        {h.user && <p className="text-[9px] text-white/50 mt-2 italic font-mono">توسط: {h.user}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setTrackedDoc(null)}
                className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
