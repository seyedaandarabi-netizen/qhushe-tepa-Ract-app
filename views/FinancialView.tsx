
import React from 'react';
import { AppDocument, Language } from '../types';
import { translations } from '../translations';

interface Props {
  docs: AppDocument[];
  lang: Language;
}

const FinancialView: React.FC<Props> = ({ docs, lang }) => {
  const t = translations[lang];

  const handleExport = () => {
    alert(lang === 'ps' ? "ډاټا بریالیتوب سره صادر شوه!" : "دیتا با موفقیت صادر شد (Mock Export)");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">{t.finance}</h2>
          <p className="text-white/50 text-sm mt-1">تخصیصات بودجه، حواله‌های مالی و کنترول مصارف.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="bg-white/5 text-white/70 border border-white/10 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined">description</span>
            {t.export}
          </button>
          <button className="accent-bg text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-purple-600/30">
            <span className="material-symbols-outlined">add_card</span>
            صدور حواله جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-l-purple-600">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">کل بودجه تخصیصی</p>
          <h3 className="text-2xl font-black text-white">۸.۵ میلیارد</h3>
          <p className="text-[10px] text-purple-400 mt-2">افغانی (AFN)</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-l-emerald-500">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">مبالغ پرداخت شده</p>
          <h3 className="text-2xl font-black text-white">۳.۲ میلیارد</h3>
          <p className="text-[10px] text-emerald-400 mt-2">تأیید شده</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-l-amber-500">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">چک‌های در انتظار</p>
          <h3 className="text-2xl font-black text-white">۱۵۰ میلیون</h3>
          <p className="text-[10px] text-amber-400 mt-2">در جریان کنترول</p>
        </div>
      </div>

      <div className="bg-[#141118] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">لیست حواله‌های مالی</h3>
          <div className="flex gap-2">
            <span className="bg-purple-600/10 text-purple-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase">سال مالی ۱۴۰۳</span>
          </div>
        </div>
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-white/5 text-white/40 text-[10px] font-bold uppercase">
              <th className="px-8 py-5">شماره حواله</th>
              <th className="px-8 py-5">تاریخ</th>
              <th className="px-8 py-5">شرح</th>
              <th className="px-8 py-5">مقدار (AFN)</th>
              <th className="px-8 py-5">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-6 font-mono text-xs text-purple-400">FIN-7729-QT</td>
              <td className="px-8 py-6 text-xs text-white/60">۱۴۰۳/۰۴/۱۵</td>
              <td className="px-8 py-6 text-xs text-white/80">پرداخت قسط اول شرکت ساختمانی نور</td>
              <td className="px-8 py-6 text-sm font-black text-white">۱۲,۵۰۰,۰۰۰</td>
              <td className="px-8 py-6">
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded">پرداخت شد</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialView;
