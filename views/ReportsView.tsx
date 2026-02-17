
import React, { useState, useMemo } from 'react';
import { AppDocument, Language, DocType, Branch, DocStatus } from '../types';
import { translations } from '../translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  docs: AppDocument[];
  lang: Language;
}

const ReportsView: React.FC<Props> = ({ docs, lang }) => {
  const t = translations[lang];
  const [filters, setFilters] = useState({
    type: 'ALL',
    branch: 'ALL',
    status: 'ALL'
  });

  const filteredData = useMemo(() => {
    return docs.filter(d => {
      const typeMatch = filters.type === 'ALL' || d.type === filters.type;
      const branchMatch = filters.branch === 'ALL' || d.branch === filters.branch;
      const statusMatch = filters.status === 'ALL' || d.status === filters.status;
      return typeMatch && branchMatch && statusMatch;
    });
  }, [docs, filters]);

  const chartData = useMemo(() => {
    const branches = [Branch.Admin, Branch.Procurement, Branch.Finance, Branch.Control, Branch.Assets];
    return branches.map(b => ({
      name: b,
      count: docs.filter(d => d.branch === b).length
    }));
  }, [docs]);

  const COLORS = ['#7f13ec', '#da13ec', '#38bdf8', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">{t.reports}</h2>
          <p className="text-white/50 text-sm mt-1">تولید گزارش‌های تخصصی و آماری برای مدیریت ارشد.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 border border-white/10 text-white/80 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined">picture_as_pdf</span>
            PDF
          </button>
          <button className="accent-bg text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
            <span className="material-symbols-outlined">description</span>
            Excel
          </button>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.filterBy} واحد</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
            value={filters.branch}
            onChange={e => setFilters({...filters, branch: e.target.value})}
          >
            <option value="ALL">همه واحدها</option>
            {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.filterBy} نوعیت</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
            value={filters.type}
            onChange={e => setFilters({...filters, type: e.target.value})}
          >
            <option value="ALL">همه انواع</option>
            {Object.values(DocType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.filterBy} وضعیت</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="ALL">همه وضعیت‌ها</option>
            {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-lg font-bold text-white mb-8">تراکم اسناد در واحدها</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} />
                <YAxis stroke="#ffffff20" fontSize={10} />
                <Tooltip contentStyle={{ background: '#141118', border: '1px solid #ffffff10' }} />
                <Bar dataKey="count" fill="#7f13ec" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-lg font-bold text-white mb-8">تفکیک اسناد فیلتر شده</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: filteredData.filter(d => d.status === DocStatus.Pending).length },
                    { name: 'Approved', value: filteredData.filter(d => d.status === DocStatus.Approved).length },
                    { name: 'Rejected', value: filteredData.filter(d => d.status === DocStatus.Rejected).length }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#141118', border: '1px solid #ffffff10' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#141118] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h4 className="text-white font-black">نتایج گزارش تفصیلی</h4>
          <span className="text-[10px] text-white/30 font-bold uppercase">{filteredData.length} سند یافت شد</span>
        </div>
        <table className="w-full text-right text-xs">
          <thead className="text-white/40 uppercase tracking-widest font-black">
            <tr className="border-b border-white/5">
              <th className="px-8 py-4 italic">Branch</th>
              <th className="px-8 py-4 italic">Type</th>
              <th className="px-8 py-4 italic">Subject</th>
              <th className="px-8 py-4 italic">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.map(d => (
              <tr key={d.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-4 text-white/60 font-mono">{d.branch}</td>
                <td className="px-8 py-4 font-bold text-purple-400">{d.type}</td>
                <td className="px-8 py-4 text-white">{d.title}</td>
                <td className="px-8 py-4">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${d.status === DocStatus.Approved ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsView;
