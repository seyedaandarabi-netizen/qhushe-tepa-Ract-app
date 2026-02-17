
import React, { useState, useMemo, useRef } from 'react';
import { AppDocument, Language, DocType, Branch, DocStatus, Attachment } from '../types';
import { translations } from '../translations';

interface Props {
  docs: AppDocument[];
  addDoc: (doc: Omit<AppDocument, 'id' | 'status'>) => void;
  lang: Language;
}

const AdministrativeView: React.FC<Props> = ({ docs, addDoc, lang }) => {
  const t = translations[lang];
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState<AppDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DocType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'ALL'>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    docNumber: '',
    inquiryNumber: '',
    type: DocType.Maktoob,
    priority: 'NORMAL' as const,
    sender: '',
    receiver: '',
    summary: '',
    description: '',
    actionsTaken: '',
    estimatedCost: undefined as number | undefined,
    isResponseReceived: false,
    responseDate: '',
    responseSummary: '',
    hasAttachments: false,
    attachments: [] as Attachment[],
    date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { calendar: 'persian' })
  });

  const branchOptions = [
    { value: Branch.Admin, label: t.branches.admin },
    { value: Branch.Procurement, label: t.branches.procurement },
    { value: Branch.Assets, label: t.branches.assets },
    { value: Branch.Transport, label: t.branches.transport },
    { value: Branch.Finance, label: t.branches.finance },
    { value: Branch.Control, label: t.branches.control },
    { value: Branch.Invoice, label: t.branches.invoice },
    { value: Branch.GeneralManager, label: t.branches.general },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(2) + ' KB',
        url: '#' 
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
        hasAttachments: true
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.docNumber || !formData.description || !formData.actionsTaken || !formData.sender || !formData.receiver) {
      alert(lang === 'ps' ? "مهرباني وکړئ ټول اړین ځایونه ډک کړئ" : "لطفاً تمام فیلدهای الزامی (*) را تکمیل نمایید.");
      return;
    }

    const timestamp = new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { hour: '2-digit', minute: '2-digit' });
    const history = [{
      from: formData.sender,
      to: formData.receiver,
      timestamp: `${formData.date} ${timestamp}`,
      action: `${t.registerDoc} (${formData.type})`,
      user: 'مدیریت دفتری'
    }];

    addDoc({ 
      ...formData, 
      branch: Branch.Admin, 
      history
    } as any);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '', docNumber: '', inquiryNumber: '', 
      type: DocType.Maktoob, priority: 'NORMAL', sender: '', receiver: '',
      summary: '', description: '',
      actionsTaken: '', estimatedCost: undefined, isResponseReceived: false,
      responseDate: '', responseSummary: '', hasAttachments: false,
      attachments: [],
      date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { calendar: 'persian' })
    });
  };

  const filteredDocs = useMemo(() => {
    return docs
      .filter(d => d.branch === Branch.Admin)
      .filter(d => filterType === 'ALL' || d.type === filterType)
      .filter(d => filterStatus === 'ALL' || d.status === filterStatus)
      .filter(d => {
        const query = searchTerm.toLowerCase();
        return (
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.docNumber.toLowerCase().includes(query)
        );
      });
  }, [docs, searchTerm, filterType, filterStatus]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">{t.administrative}</h2>
          <p className="text-white/50 text-sm mt-1">{t.realTimeMonitor}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="accent-bg text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-purple-600/40 hover:scale-105 transition-all">
          <span className="material-symbols-outlined">post_add</span>
          {t.registerDoc}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-purple-400">search</span>
          <input type="text" placeholder={t.search} className="bg-transparent border-none focus:ring-0 text-sm w-full text-white outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">نوعیت:</span>
            <select 
              className="bg-transparent border-none focus:ring-0 text-xs text-purple-400 font-bold outline-none cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DocType | 'ALL')}
            >
              <option value="ALL" className="bg-[#141118]">همه</option>
              <option value={DocType.Maktoob} className="bg-[#141118]">{t.maktoob}</option>
              <option value={DocType.Pishnehad} className="bg-[#141118]">{t.pishnehad}</option>
              <option value={DocType.Estelam} className="bg-[#141118]">{t.estelam}</option>
            </select>
          </div>

          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">وضعیت:</span>
            <select 
              className="bg-transparent border-none focus:ring-0 text-xs text-emerald-400 font-bold outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocStatus | 'ALL')}
            >
              <option value="ALL" className="bg-[#141118]">همه</option>
              <option value={DocStatus.Pending} className="bg-[#141118]">{t.pending}</option>
              <option value={DocStatus.Approved} className="bg-[#141118]">{t.approved}</option>
              <option value={DocStatus.Rejected} className="bg-[#141118]">{t.rejected}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#141118] border border-white/5 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-right min-w-[900px]">
          <thead className="bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">نوع / {t.status}</th>
              <th className="px-8 py-5">{t.docNumber}</th>
              <th className="px-8 py-5">{t.subject}</th>
              <th className="px-8 py-5">فرستنده/گیرنده</th>
              <th className="px-8 py-5">{t.date}</th>
              <th className="px-8 py-5 text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredDocs.map(doc => (
              <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/60 w-fit">{doc.type}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-black w-fit ${doc.status === DocStatus.Approved ? 'bg-emerald-500/10 text-emerald-400' : doc.status === DocStatus.Rejected ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {doc.status === DocStatus.Approved ? t.approved : doc.status === DocStatus.Rejected ? t.rejected : t.pending}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 font-bold text-purple-400 font-mono">
                  <div className="flex items-center gap-2">
                    {doc.docNumber}
                    {(doc.hasAttachments || (doc.attachments && doc.attachments.length > 0)) && (
                      <span className="material-symbols-outlined text-[16px] text-blue-400" title={t.attachments}>attach_file</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 max-w-md">
                  <div className="text-white font-bold">{doc.title}</div>
                  {doc.type === DocType.Estelam && (
                    <div className="mt-2 space-y-1.5">
                      {doc.inquiryNumber && (
                        <div className="text-[10px] text-purple-400/60 font-mono">
                          <span className="opacity-50 tracking-tighter uppercase mr-1">Inquiry:</span>
                          {doc.inquiryNumber}
                        </div>
                      )}
                      {doc.isResponseReceived && (
                        <div className="text-[10px] bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl text-emerald-400/90 leading-relaxed shadow-inner animate-in fade-in zoom-in-95">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-[9px] uppercase tracking-widest">{t.responseSummary}:</span>
                            <span className="text-[9px] font-mono opacity-60 italic">{doc.responseDate}</span>
                          </div>
                          <p className="line-clamp-2 italic">{doc.responseSummary || '---'}</p>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1 text-[10px] text-white/60">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-purple-400">upload</span> {doc.sender}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-emerald-400">download</span> {doc.receiver}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-[11px] text-white/40">{doc.date}</td>
                <td className="px-8 py-6 text-center">
                  <button onClick={() => setShowHistoryModal(doc)} className="material-symbols-outlined text-white/20 hover:text-purple-400 transition-colors p-2 hover:bg-white/5 rounded-full" title={t.history}>history</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-dark w-full max-w-3xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white">{t.registerDoc}</h3>
              <button onClick={() => setShowModal(false)} className="material-symbols-outlined text-white/40 hover:text-white transition-colors">close</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">نوعیت سند</label>
                <div className="flex gap-4">
                  {[DocType.Maktoob, DocType.Pishnehad, DocType.Estelam].map(type => (
                    <button 
                      key={type} 
                      type="button" 
                      onClick={() => setFormData({...formData, type})} 
                      className={`flex-1 py-4 rounded-2xl text-xs font-black border transition-all ${formData.type === type ? 'accent-bg text-white border-transparent shadow-lg shadow-purple-600/20' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'}`}
                    >
                      {type === DocType.Maktoob ? t.maktoob : type === DocType.Pishnehad ? t.pishnehad : t.estelam}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.subject} *</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-purple-600/50 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.docNumber} *</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-purple-400 font-mono outline-none focus:ring-2 focus:ring-purple-600/50 transition-all" value={formData.docNumber} onChange={e => setFormData({...formData, docNumber: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.sender} *</label>
                <select required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-purple-600/50 transition-all appearance-none" value={formData.sender} onChange={e => setFormData({...formData, sender: e.target.value})}>
                  <option value="" className="bg-[#141118]">انتخاب فرستنده</option>
                  {branchOptions.map(opt => <option key={opt.value} value={opt.label} className="bg-[#141118]">{opt.label}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.receiver} *</label>
                <select required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-purple-600/50 transition-all appearance-none" value={formData.receiver} onChange={e => setFormData({...formData, receiver: e.target.value})}>
                  <option value="" className="bg-[#141118]">انتخاب گیرنده</option>
                  {branchOptions.map(opt => <option key={opt.value} value={opt.label} className="bg-[#141118]">{opt.label}</option>)}
                </select>
              </div>

              {formData.type === DocType.Estelam && (
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.inquiryNumber}</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none font-mono" value={formData.inquiryNumber} onChange={e => setFormData({...formData, inquiryNumber: e.target.value})} placeholder="QT-EST-00X" />
                </div>
              )}

              {(formData.type === DocType.Maktoob || formData.type === DocType.Pishnehad) && (
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.estimatedCost} (اختیاری)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-emerald-400 font-bold outline-none" value={formData.estimatedCost || ''} onChange={e => setFormData({...formData, estimatedCost: e.target.value ? parseInt(e.target.value) : undefined})} placeholder="AFN" />
                </div>
              )}

              {formData.type === DocType.Estelam && (
                <div className="col-span-2 grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="col-span-2 space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.responseReceived}</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none" value={formData.isResponseReceived ? 'بلی' : 'خیر'} onChange={e => setFormData({...formData, isResponseReceived: e.target.value === 'بلی'})}>
                      <option value="خیر" className="bg-[#141118]">خیر</option>
                      <option value="بلی" className="bg-[#141118]">بلی</option>
                    </select>
                  </div>
                  {formData.isResponseReceived && (
                    <>
                      <div className="space-y-2 animate-in slide-in-from-top-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">تاریخ پاسخ</label>
                        <input className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={formData.responseDate} onChange={e => setFormData({...formData, responseDate: e.target.value})} placeholder="۱۴۰۳/۰۸/۲۲" />
                      </div>
                      <div className="space-y-2 animate-in slide-in-from-top-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.responseSummary}</label>
                        <input className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={formData.responseSummary} onChange={e => setFormData({...formData, responseSummary: e.target.value})} placeholder="خلاصه جواب دریافت شده" />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.details} *</label>
                <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none h-28 focus:ring-2 focus:ring-purple-600/50 transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.actionsTaken} *</label>
                <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none h-28 focus:ring-2 focus:ring-purple-600/50 transition-all resize-none" value={formData.actionsTaken} onChange={e => setFormData({...formData, actionsTaken: e.target.value})} />
              </div>

              <div className="col-span-2">
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileUpload} />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${formData.hasAttachments ? 'bg-purple-600/10 border-purple-600 text-purple-400' : 'bg-white/5 border-white/10 text-white/20 hover:border-white/20'}`}
                >
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  <span className="text-xs font-black">{formData.attachments.length > 0 ? `${formData.attachments.length} فایل ضمیمه شد` : t.attachments}</span>
                </button>
                {formData.attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.attachments.map(file => (
                      <div key={file.id} className="bg-white/5 px-3 py-1 rounded-full text-[10px] border border-white/10 text-white/60 flex items-center gap-2">
                        {file.name}
                        <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter(f => f.id !== file.id) }))} className="material-symbols-outlined text-[14px] hover:text-red-400">close</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 accent-bg text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-95">{t.save}</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-white/5 text-white/40 rounded-3xl hover:bg-white/10 hover:text-white transition-all">{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-dark w-full max-w-lg rounded-[2.5rem] p-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white">{t.history}</h3>
              <button onClick={() => setShowHistoryModal(null)} className="material-symbols-outlined text-white/40">close</button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:right-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
              {(showHistoryModal.history || []).map((h, i) => (
                <div key={i} className="relative pr-10">
                  <div className="absolute right-2.5 top-1.5 size-4 rounded-full accent-bg border-4 border-[#0f0a1a] shadow-lg shadow-purple-600/40 z-10" />
                  <div className="glass p-5 rounded-3xl border-white/5 hover:border-purple-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black text-white group-hover:text-purple-400 transition-colors">{h.action}</p>
                      <span className="text-[9px] font-mono text-purple-400/60 bg-purple-600/5 px-2 py-0.5 rounded-full">{h.timestamp}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-white/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">sync_alt</span>
                        {h.from} <span className="text-purple-400/50">←</span> {h.to}
                      </p>
                      {h.user && (
                        <p className="text-[10px] text-white/60 font-medium flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[12px]">account_circle</span>
                          توسط: {h.user}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!showHistoryModal.history || showHistoryModal.history.length === 0) && (
                <div className="flex flex-col items-center py-12 text-white/20">
                  <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                  <p className="text-xs font-bold italic">تاریخچه‌ای یافت نشد.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrativeView;
