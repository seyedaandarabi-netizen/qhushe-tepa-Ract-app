
import React, { useState } from 'react';
import { Language, User, Branch } from '../types';
import { translations } from '../translations';

interface Props {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const LoginView: React.FC<Props> = ({ onLogin, lang, setLang }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Branch>(Branch.GeneralManager);
  const t = translations[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: '1',
      username,
      fullName: username || 'مدیر عمومی',
      role: role
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a] relative overflow-hidden" dir={lang === 'dr' || lang === 'ps' || lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-pink-500/10 blur-[100px] pointer-events-none" />

      <div className="glass-dark w-full max-w-md rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 border border-white/10 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="size-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-600/30">
            <span className="material-symbols-outlined text-white text-4xl">water_drop</span>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight text-center">{t.login}</h1>
          <p className="text-white/40 text-xs mt-2 text-center uppercase tracking-widest">{t.title}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white/70 text-xs font-bold mr-1">{t.username}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl">person</span>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 outline-none transition-all"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="User ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-xs font-bold mr-1">{t.password}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl">lock</span>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 outline-none transition-all"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-xs font-bold mr-1">{t.selectBranch}</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Branch)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-600/50 outline-none appearance-none"
            >
              <option value={Branch.GeneralManager}>{t.adminPanel}</option>
              <option value={Branch.Admin}>{t.administrative}</option>
              <option value={Branch.Procurement}>{t.procurement}</option>
              <option value={Branch.Finance}>{t.finance}</option>
              <option value={Branch.Control}>{t.control}</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black py-4 rounded-xl shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {t.login.toUpperCase()}
          </button>
        </form>

        <div className="mt-10 flex justify-center gap-4">
          {(['dr', 'ps', 'fa'] as Language[]).map(l => (
            <button key={l} onClick={() => setLang(l)} className={`text-[10px] font-bold ${lang === l ? 'text-purple-500' : 'text-white/30 hover:text-white'}`}>
              {l === 'dr' ? 'DARI' : l === 'ps' ? 'PASHTO' : 'FARSI'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginView;
