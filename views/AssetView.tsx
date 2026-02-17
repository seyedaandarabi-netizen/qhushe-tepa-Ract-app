
import React, { useState } from 'react';
import { AppDocument, Language, DocType } from '../types';
import { translations } from '../translations';

interface Asset {
  id: string;
  name: string;
  category: string;
  m7Number: string;
  location: string;
  status: 'STORED' | 'SENT' | 'DAMAGED';
  date: string;
}

interface Props {
  docs: AppDocument[];
  lang: Language;
}

const AssetView: React.FC<Props> = ({ docs, lang }) => {
  const t = translations[lang];
  const [showM7Modal, setShowM7Modal] = useState(false);
  
  const [inventory, setInventory] = useState<Asset[]>([
    {
      id: '1',
      name: lang === 'ps' ? '۲۵۰ کيلواټه ډیزلي جنراتور' : 'جنراتور دیزلی ۲۵۰ کیلوات',
      category: lang === 'ps' ? 'درانه تجهیزات' : 'تجهیزات سنگین',
      m7Number: 'M7-2024-0081',
      location: lang === 'ps' ? 'مزار شریف سایټ' : 'سایت مزار شریف',
      status: 'STORED',
      date: '۱۴۰۳/۰۲/۱۵'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'تجهیزات سنگین',
    m7Number: `M7-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    location: '',
    status: 'STORED' as const,
    date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { calendar: 'persian' })
  });

  const handleSubmitM7 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
        alert("لطفاً تمامی فیلدهای الزامی را پر کنید");
        return;
    }
    const newAsset: Asset = { ...formData, id: Math.random().toString(36).substr(2, 9) };
    setInventory([newAsset, ...inventory]);
    setShowM7Modal(false);
    resetAssetForm();
  };

  const resetAssetForm = () => {
    setFormData({
        name: '', 
        category: 'تجهیزات سنگین', 
        m7Number: `M7-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        location: '', 
        status: 'STORED', 
        date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { calendar: 'persian' })
      });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">{t.assets}</h2>
          <p className="text-white/50 text-sm mt-1">{t.realTimeMonitor}</p>
        </div>
        <button onClick={() => setShowM7Modal(true)} className="accent-bg text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
          <span className="material-symbols-outlined">inventory</span>
          {t.issueM7}
        </button>
      </div>

      <div className="bg-[#141118] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-right">
          <thead className="bg-white/5 text-white/40 text-[10px] font-bold uppercase">
            <tr>
              <th className="px-8 py-5">{t.assetName}</th>
              <th className="px-8 py-5">{t.category}</th>
              <th className="px-8 py-5">نمبر م-۷</th>
              <th className="px-8 py-5">{t.location}</th>
              <th className="px-8 py-5">{t.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 font-bold text-white">{item.name}</td>
                <td className="px-8 py-6 text-white/40">{item.category}</td>
                <td className="px-8 py-6 font-mono text-purple-400/80">{item.m7Number}</td>
                <td className="px-8 py-6 text-white/60">{item.location}</td>
                <td className="px-8 py-6">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'STORED' ? 'bg-emerald-500/10 text-emerald-500' : item.status === 'SENT' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                    {item.status === 'STORED' ? t.stored : item.status === 'SENT' ? t.sent : t.damaged}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showM7Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-dark w-full max-w-xl rounded-[2rem] p-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-white mb-8">{t.issueM7}</h3>
            <form onSubmit={handleSubmitM7} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.assetName} *</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-600/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مثلاً: لودر هیوندای" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.category} *</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="تجهیزات سنگین" className="bg-[#141118]">تجهیزات سنگین</option>
                  <option value="وسایل نقلیه" className="bg-[#141118]">وسایل نقلیه</option>
                  <option value="ابزارآلات" className="bg-[#141118]">ابزارآلات</option>
                  <option value="تجهیزات دفتری" className="bg-[#141118]">تجهیزات دفتری</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.location} *</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-600/50" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="موقعیت فعلی" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">نمبر م-۷</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-purple-400 font-mono outline-none" value={formData.m7Number} onChange={e => setFormData({...formData, m7Number: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">وضعیت جنس</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="STORED" className="bg-[#141118]">{t.stored}</option>
                  <option value="SENT" className="bg-[#141118]">{t.sent}</option>
                  <option value="DAMAGED" className="bg-[#141118]">{t.damaged}</option>
                </select>
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 accent-bg text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all">{t.save}</button>
                <button type="button" onClick={() => setShowM7Modal(false)} className="px-8 py-4 bg-white/5 text-white/40 rounded-2xl font-bold hover:bg-white/10 transition-all">{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetView;
