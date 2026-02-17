
import React, { useState, useMemo } from 'react';
import { AppDocument, Language, DocStatus } from '../types';
import { translations } from '../translations';

interface Props {
  docs: AppDocument[];
  onUpdate: (id: string, status: DocStatus, reason?: string, reasons?: string[]) => void;
  lang: Language;
}

const ControlView: React.FC<Props> = ({ docs, onUpdate, lang }) => {
  const t = translations[lang];
  const [selectedDoc, setSelectedDoc] = useState<AppDocument | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'ACTIVE'>('ACTIVE');

  const rejectionChecklist = [
    t.rejectionReasons.incorrectQuotation,
    t.rejectionReasons.discrepancy,
    t.rejectionReasons.expiredLicense,
    t.rejectionReasons.siteIssue,
    t.rejectionReasons.nonCompliance,
    t.rejectionReasons.proposalProblem
  ];

  const handleToggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleConfirmRejection = () => {
    if (selectedDoc) {
      const reasonStr = selectedReasons.join(' | ');
      onUpdate(selectedDoc.id, DocStatus.Rejected, reasonStr, selectedReasons);
      setSelectedDoc(null);
      setSelectedReasons([]);
    }
  };

  const displayDocs = useMemo(() => {
    if (filterStatus === 'ACTIVE') {
      return docs.filter(d => d.status === DocStatus.Pending || d.status === DocStatus.Processing);
    }
    return docs.filter(d => d.status === filterStatus);
  }, [docs, filterStatus]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">{t.control}</h2>
          <p className="text-white/50 text-sm mt-1">بررسی نهایی اسناد و کنترول کیفیت فرآیندها.</p>
        </div>
        
        <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">فیلتر وضعیت:</span>
          <select 
            className="bg-transparent border-none focus:ring-0 text-xs text-purple-400 font-bold outline-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="ACTIVE" className="bg-[#141118]">اسناد جاری (در انتظار)</option>
            <option value={DocStatus.Approved} className="bg-[#141118]">{t.approved}</option>
            <option value={DocStatus.Rejected} className="bg-[#141118]">{t.rejected}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayDocs.map(doc => (
          <div key={doc.id} className="glass p-6 rounded-3xl border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-purple-500/30 transition-all shadow-xl">
            <div className="flex gap-6 items-center flex-1">
              <div className="size-14 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-600/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">
                  {doc.status === DocStatus.Approved ? 'verified' : doc.status === DocStatus.Rejected ? 'cancel' : 'fact_check'}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-white truncate text-lg group-hover:text-purple-400 transition-colors">{doc.title}</h4>
                <div className="flex gap-4 text-[10px] text-white/40 mt-1">
                  <span className="font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">{doc.docNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">{doc.type}</span>
                  <span>{t.sender}: {doc.sender}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {(doc.status === DocStatus.Pending || doc.status === DocStatus.Processing) && (
                <>
                  <button 
                    onClick={() => onUpdate(doc.id, DocStatus.Approved)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    تایید نهایی
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedDoc(doc);
                      setSelectedReasons([]);
                    }}
                    className="px-6 py-3 bg-red-600/10 text-red-500 rounded-xl text-xs font-black border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
                  >
                    استرداد (رد)
                  </button>
                </>
              )}
              {doc.status === DocStatus.Approved && (
                <span className="px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black border border-emerald-500/20">
                  تایید شده
                </span>
              )}
              {doc.status === DocStatus.Rejected && (
                <span className="px-6 py-3 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black border border-red-500/20">
                  مسترد شده
                </span>
              )}
            </div>
          </div>
        ))}
        
        {displayDocs.length === 0 && (
          <div className="py-24 text-center glass rounded-3xl border-dashed border-white/10 flex flex-col items-center">
            <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-emerald-500 text-5xl">task_alt</span>
            </div>
            <p className="text-white/20 font-bold italic tracking-widest uppercase text-xs">سندی برای نمایش در این بخش وجود ندارد</p>
          </div>
        )}
      </div>

      {filterStatus === DocStatus.Rejected && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white/40 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-400">history</span>
            جزئیات اسناد مسترد شده
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayDocs.map(doc => (
              <div key={doc.id} className="glass p-5 rounded-2xl border-red-500/10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-white font-bold text-sm">{doc.title}</span>
                  <span className="text-[9px] font-mono text-white/20">{doc.date}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-red-400/80 font-black uppercase tracking-widest">علل استرداد:</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.rejectionReasons?.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-red-500/5 border border-red-500/10 text-red-500/70 text-[10px]">{r}</span>
                    ))}
                    {(!doc.rejectionReasons || doc.rejectionReasons.length === 0) && (
                      <span className="text-[10px] text-white/20 italic">{doc.rejectionReason}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-dark w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">انتخاب دلایل استرداد</h3>
              <button onClick={() => setSelectedDoc(null)} className="material-symbols-outlined text-white/40 hover:text-white transition-colors">close</button>
            </div>
            
            <div className="space-y-2 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-4">دلایل عدم انطباق با مقررات:</p>
              {rejectionChecklist.map(reason => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleToggleReason(reason)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between text-[11px] font-bold ${
                    selectedReasons.includes(reason) 
                      ? 'bg-red-600/20 border-red-500 text-red-500 shadow-lg shadow-red-500/10' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="flex-1">{reason}</span>
                  {selectedReasons.includes(reason) ? (
                    <span className="material-symbols-outlined text-[18px] text-red-500 ml-3">check_box</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px] text-white/10 ml-3">check_box_outline_blank</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                disabled={selectedReasons.length === 0}
                onClick={handleConfirmRejection}
                className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${selectedReasons.length > 0 ? 'bg-red-600 text-white shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-95' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
              >
                تایید و استرداد نهایی
              </button>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="px-6 py-4 bg-white/5 text-white/40 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all text-xs"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlView;
