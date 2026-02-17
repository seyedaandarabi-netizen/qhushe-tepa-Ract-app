
import React from 'react';
import { Branch, User, Language } from '../types';
import { translations } from '../translations';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  user: User;
  lang: Language;
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({ activeView, setActiveView, user, lang, onLogout }) => {
  const t = translations[lang];

  const menuItems = [
    { id: 'dashboard', label: t.adminPanel, icon: 'dashboard', roles: [Branch.GeneralManager, Branch.Admin, Branch.Finance] },
    { id: 'administrative', label: t.administrative, icon: 'folder_shared', roles: [Branch.GeneralManager, Branch.Admin] },
    { id: 'procurement', label: t.procurement, icon: 'shopping_cart', roles: [Branch.GeneralManager, Branch.Procurement] },
    { id: 'assets', label: t.assets, icon: 'inventory_2', roles: [Branch.GeneralManager, Branch.Assets] },
    { id: 'finance', label: t.finance, icon: 'account_balance_wallet', roles: [Branch.GeneralManager, Branch.Finance] },
    { id: 'control', label: t.control, icon: 'verified_user', roles: [Branch.GeneralManager, Branch.Control] },
    { id: 'reports', label: t.reports, icon: 'analytics', roles: [Branch.GeneralManager, Branch.Admin, Branch.Finance] },
  ];

  return (
    <aside className="w-64 bg-[#141118] border-l border-white/5 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="size-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="material-symbols-outlined text-white">water_drop</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold leading-tight text-white uppercase tracking-wider">قوش تپه</h1>
          <p className="text-[10px] text-white/40 font-mono tracking-tighter">QT-IMS v2.1</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-6 custom-scrollbar">
        {menuItems.map(item => (
          (user.role === Branch.GeneralManager || item.roles.includes(user.role)) && (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-wide">{item.label}</span>
            </button>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-white/30 hover:text-red-400 transition-colors">
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="text-sm font-medium">{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
