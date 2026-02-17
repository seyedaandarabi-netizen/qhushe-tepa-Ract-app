
import React, { useState, useMemo } from 'react';
import { AppDocument, Language, DocType, DocStatus, Branch } from '../types';
import { translations } from '../translations';

interface Props {
  docs: AppDocument[];
  addDoc: (doc: Omit<AppDocument, 'id' | 'status'>) => void;
  lang: Language;
}

const ProcurementView: React.FC<Props> = ({ docs, addDoc, lang }) => {
  const t = translations[lang];
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<AppDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'ALL'>('ALL');
  const [procurementFilter, setProcurementFilter] = useState<'ALL' | 'quoted' | 'contracted' | 'invoice_approved'>('ALL');

  const [formData, setFormData] = useState({
    title: '',
    docNumber: '', 
    inquiryNumber: '', 
    isQuoted: false, 
    isContracted: false, 
    contractor: '', 
    contractorContact: '',
    contractorAddress: '',
    grossAmount: 0, 
    isInvoiceApproved: false, 
    sender: t.branches.procurement,
    receiver: t.branches.finance,
    type: DocType.Pishnehad,
    priority: 'NORMAL' as const,
    description: '',
    actionsTaken: '',
    date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { calendar: 'persian' })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDoc({ 
      ...formData, 
      branch: Branch.Procurement,
      status: formData.isInvoiceApproved ? DocStatus.Approved : DocStatus.Processing
    } as any);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '', docNumber: '', inquiryNumber: '', isQuoted: false, isContracted: false,
      contractor: '', contractorContact: '', contractorAddress: '', grossAmount: 0, 
      isInvoiceApproved: false, sender: t.branches.procurement, receiver: t.branches.finance, 
      type: DocType.Pishnehad, priority: 'NORMAL', description: '', actionsTaken: '',
      date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'fa-AF', { calendar: 'persian' })
    });
  };

  const getStatusBadge = (doc: AppDocument) => {
    if (doc.isInvoiceApproved) return { 
      label: t.procurementStatus.invoiceApproved, 
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: 'verified' 
    };
    if (doc.isContracted) return { 
      label: t.procurementStatus.contractSigned, 
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: 'contract'
    };
    if (doc.isQuoted) return { 
      label: t.procurementStatus.quotationReceived, 
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: 'request_quote'
    };
    return { 
      label: t.procurementStatus.awaitingQuotation, 
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: 'hourglass_empty'
    };
  };

  const filteredDocs = useMemo(() => {
    return docs
      .filter(d => d.type === DocType.Pishnehad || d.branch === Branch.Procurement)
      .filter(d => filterStatus === 'ALL' || d.status === filterStatus)
      .filter(d => {
        if (procurementFilter === 'quoted') return d.isQuoted;
        if (procurementFilter === 'contracted') return d.isContracted;
        if (procurementFilter === 'invoice_approved') return d.isInvoiceApproved;
        return true;
      })
      .filter(d => {
        const query = searchTerm.toLowerCase();
        return (
          d.title.toLowerCase().includes(query) ||
          d.docNumber.toLowerCase().includes(query) ||
          (d.contractor && d.contractor.toLowerCase().includes(query))
        );
      });
  }, [docs, searchTerm, filterStatus, procurementFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">{t.procurement}</h2>
          <p className="text-white/50 text-sm mt-1">مدیریت هوشمند چرخه تدارکات و قراردادها.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="accent-bg text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-purple-600/40 hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          {t.registerDoc}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-purple-400">search</span>
          <input 
            type="text" 
            placeholder={t.search} 
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-white outline-none" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">وضعیت:</span>
            <select 
              className="bg-transparent border-none focus:ring-0 text-xs text-emerald-400 font-bold outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocStatus | 'ALL')}
            >
              <option value="ALL" className="bg-[#141118]">همه</option>
              <option value={DocStatus.Pending} className="bg-[#141118]">{t.pending}</option>
              <option value={DocStatus.Processing} className="bg-[#141118]">در جریان</option>
              <option value={DocStatus.Approved} className="bg-[#141118]">{t.approved}</option>
              <option value={DocStatus.Rejected} className="bg-[#141118]">{t.rejected}</option>
            </select>
          </div>

          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">مرحله تدارکاتی:</span>
            <select 
              className="bg-transparent border-none focus:ring-0 text-xs text-purple-400 font-bold outline-none cursor-pointer"
              value={procurementFilter}
              onChange={(e) => setProcurementFilter(e.target.value as any)}
            >
              <option value="ALL" className="bg-[#141118]">همه مراحل</option>
              <option value="quoted" className="bg-[#141118]">{t.procurementStatus.quotationReceived}</option>
              <option value="contracted" className="bg-[#141118]">{t.procurementStatus.contractSigned}</option>
              <option value="invoice_approved" className="bg-[#141118]">{t.procurementStatus.invoiceApproved}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredDocs.map(doc => {
          const badge = getStatusBadge(doc);
          return (
            <div key={doc.id} className="glass group relative p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/50 transition-all duration-500 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">نمبر پیشنهاد</span>
                  <h4 className="text-xl font-black text-white">{doc.docNumber}</h4>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border flex items-center gap-2 ${badge.color}`}>
                  <span className="material-symbols-outlined text-[16px]">{badge.icon}</span>
                  {badge.label}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{doc.title}</h5>
                <p className="text-xs text-white/40 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">tag</span> شماره استعلام: <span className="text-white font-mono">{doc.inquiryNumber || 'N/A'}</span>
                </p>
              </div>

              {doc.isContracted && (
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg accent-bg flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[18px]">corporate_fare</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.contractor}</p>
                      <p className="text-sm font-black text-white">{doc.contractor}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">{t.contractorContact}</p>
                      <p className="text-xs text-white/80">{doc.contractorContact || '---'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">{t.contractorAddress}</p>
                      <p className="text-xs text-white/80 truncate" title={doc.contractorAddress}>{doc.contractorAddress || '---'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">{t.grossAmount}</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {(doc.grossAmount || 0).toLocaleString()} <span className="text-xs font-bold text-white/40">AFN</span>
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedContract(doc)}
                  className="px-6 py-3 bg-purple-600/10 text-purple-400 text-xs font-black rounded-xl border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">pageview</span>
                  {t.viewContract}
                </button>
              </div>
            </div>
          );
        })}
        {filteredDocs.length === 0 && (
          <div className="col-span-full py-24 text-center glass rounded-3xl border-dashed border-white/10 flex flex-col items-center">
            <span className="material-symbols-outlined text-white/10 text-7xl">search_off</span>
            <p className="text-white/20 font-bold mt-4 italic tracking-widest uppercase text-xs">سندی با این مشخصات یافت نشد</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-dark w-full max-w-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h3 className="text-2xl font-black text-white mb-8">ثبت چرخه تدارکات و قرارداد</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">عنوان پیشنهاد تدارکاتی *</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white focus:ring-2 focus:ring-purple-600/50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">نمبر پیشنهاد *</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-purple-400 font-mono" value={formData.docNumber} onChange={e => setFormData({...formData, docNumber: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">شماره استعلام بها (Inquiry No)</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white font-mono" value={formData.inquiryNumber} onChange={e => setFormData({...formData, inquiryNumber: e.target.value})} />
              </div>
              
              <div className="col-span-2 grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">وضعیت کوتیشن</label>
                  <div className="flex bg-white/5 p-1 rounded-xl">
                    <button type="button" onClick={() => setFormData({...formData, isQuoted: false})} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${!formData.isQuoted ? 'bg-amber-500 text-white shadow-md' : 'text-white/20'}`}>در انتظار</button>
                    <button type="button" onClick={() => setFormData({...formData, isQuoted: true})} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${formData.isQuoted ? 'bg-purple-600 text-white shadow-md' : 'text-white/20'}`}>دریافت شد</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">عقد قرارداد</label>
                  <div className="flex bg-white/5 p-1 rounded-xl">
                    <button type="button" onClick={() => setFormData({...formData, isContracted: false})} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${!formData.isContracted ? 'bg-red-500/20 text-red-500 shadow-md' : 'text-white/20'}`}>خیر</button>
                    <button type="button" onClick={() => setFormData({...formData, isContracted: true})} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${formData.isContracted ? 'bg-blue-600 text-white shadow-md' : 'text-white/20'}`}>بلی</button>
                  </div>
                </div>
              </div>

              {formData.isContracted && (
                <div className="col-span-2 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.contractor}</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white" value={formData.contractor} onChange={e => setFormData({...formData, contractor: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.contractorContact}</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white" value={formData.contractorContact} onChange={e => setFormData({...formData, contractorContact: e.target.value})} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.contractorAddress}</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white" value={formData.contractorAddress} onChange={e => setFormData({...formData, contractorAddress: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.grossAmount} (AFN)</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-emerald-400 font-black" value={formData.grossAmount || ''} onChange={e => setFormData({...formData, grossAmount: parseInt(e.target.value || '0')})} placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">تایید نهایی انوائس</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none appearance-none text-white" value={formData.isInvoiceApproved ? 'بلی' : 'خیر'} onChange={e => setFormData({...formData, isInvoiceApproved: e.target.value === 'بلی'})}>
                  <option value="خیر" className="bg-[#141118]">در انتظار</option>
                  <option value="بلی" className="bg-[#141118]">تایید شده</option>
                </select>
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 accent-bg text-white font-black py-5 rounded-3xl shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all">ثبت نهایی و انتقال به جریان مالی</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-white/5 text-white/40 rounded-3xl hover:bg-white/10 transition-all">{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedContract && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in">
          <div className="glass-dark w-full max-w-lg rounded-[2.5rem] p-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <h3 className="text-xl font-black text-white">{t.viewContract}</h3>
              <button onClick={() => setSelectedContract(null)} className="material-symbols-outlined text-white/40 hover:text-white transition-colors">close</button>
            </div>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">نمبر پیشنهاد</p>
                    <p className="text-sm text-purple-400 font-black font-mono">{selectedContract.docNumber}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">شماره استعلام</p>
                    <p className="text-sm text-white font-black font-mono">{selectedContract.inquiryNumber || '---'}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">{t.contractor}</p>
                    <p className="text-base text-white font-black">{selectedContract.contractor || 'نامشخص'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">{t.contractorContact}</p>
                      <p className="text-xs text-white/80 font-mono">{selectedContract.contractorContact || '---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">{t.contractorAddress}</p>
                      <p className="text-xs text-white/80 leading-relaxed">{selectedContract.contractorAddress || '---'}</p>
                    </div>
                  </div>
               </div>
               <div className="p-6 accent-bg rounded-3xl shadow-xl shadow-purple-600/30 border border-white/10">
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">{t.grossAmount}</p>
                  <p className="text-3xl font-black text-white">{(selectedContract.grossAmount || 0).toLocaleString()} <span className="text-xs opacity-70">AFN</span></p>
               </div>
               <button onClick={() => setSelectedContract(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/5">بستن پنجره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementView;
