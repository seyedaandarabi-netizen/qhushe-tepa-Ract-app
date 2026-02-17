
import React from 'react';
// Added DocType to the imports
import { AppDocument, Language, User, DocStatus, DocType } from '../types';
import { translations } from '../translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  docs: AppDocument[];
  lang: Language;
  user: User;
}

const Dashboard: React.FC<Props> = ({ docs, lang, user }) => {
  const t = translations[lang];

  const stats = [
    { label: t.totalDocs, value: docs.length, color: 'purple', icon: 'description' },
    { label: t.pending, value: docs.filter(d => d.status === DocStatus.Pending).length, color: 'amber', icon: 'pending_actions' },
    { label: t.approved, value: docs.filter(d => d.status === DocStatus.Approved).length, color: 'emerald', icon: 'verified' },
    { label: t.rejected, value: docs.filter(d => d.status === DocStatus.Rejected).length, color: 'red', icon: 'cancel' }
  ];

  const data = [
    { name: 'حمل', budget: 400, actual: 240 },
    { name: 'ثور', budget: 300, actual: 139 },
    { name: 'جوزا', budget: 200, actual: 980 },
    { name: 'سرطان', budget: 278, actual: 390 },
    { name: 'اسد', budget: 189, actual: 480 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-black text-white">{t.adminPanel}</h2>
        <p className="text-white/50 text-sm mt-1">{t.realTimeMonitor}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="glass p-6 rounded-2xl border-purple-500/20 group hover:border-purple-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-${s.color}-500/10 text-${s.color}-400`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <span className="text-xs text-slate-500 font-bold">LIVE</span>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-8">{t.budgetConsumption}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141118', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="budget" fill="#7f13ec" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#da13ec" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">جریان اسناد اخیر</h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {docs.slice(0, 5).map(doc => (
              <div key={doc.id} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${doc.status === DocStatus.Approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {/* DocType correctly identified now after import fix */}
                  <span className="material-symbols-outlined text-sm">{doc.type === DocType.Maktoob ? 'mail' : 'description'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{doc.title}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{doc.sender} ← {doc.receiver}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-purple-400 transition-all">مشاهده تمامی فعالیت‌ها</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
