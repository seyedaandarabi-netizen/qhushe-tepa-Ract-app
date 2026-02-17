
import React, { useState, useEffect, useMemo } from 'react';
import { Language, Branch, User, AppDocument, DocType, DocStatus, Notification } from './types';
import { translations } from './translations';
import LoginView from './views/LoginView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import AdministrativeView from './views/AdministrativeView';
import ProcurementView from './views/ProcurementView';
import FinancialView from './views/FinancialView';
import ControlView from './views/ControlView';
import AssetView from './views/AssetView';
import ReportsView from './views/ReportsView';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('dr');
  const [user, setUser] = useState<User | null>(null);
  const [docs, setDocs] = useState<AppDocument[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const t = translations[lang];

  useEffect(() => {
    const initialDocs: AppDocument[] = [
      {
        id: '1',
        docNumber: 'QT-MK-1402-0842',
        type: DocType.Maktoob,
        title: 'استملاک زمین برای بخش ۴',
        sender: 'وزارت زراعت',
        receiver: 'مدیریت اداری',
        date: '۱۴۰۲/۰۸/۰۲',
        status: DocStatus.Approved,
        priority: 'URGENT',
        description: 'درخواست استملاک زمین‌های اطراف کانال در بخش چهارم.',
        actionsTaken: 'مکتوب دریافت و در دفتر ثبت شد.',
        branch: Branch.Admin,
        history: [
          { from: 'وزارت زراعت', to: 'مدیریت اداری', timestamp: '۱۴۰۲/۰۸/۰۲ ۱۰:۱۵', action: 'دریافت مکتوب و ورود به سیستم', user: 'احمدی - مدیر اداری' },
          { from: 'مدیریت اداری', to: 'ریاست عمومی', timestamp: '۱۴۰۲/۰۸/۰۳ ۰۹:۰۰', action: 'ارسال جهت بررسی رئیس', user: 'احمدی - مدیر اداری' },
          { from: 'ریاست عمومی', to: 'مدیریت اداری', timestamp: '۱۴۰۲/۰۸/۰۴ ۱۱:۳۰', action: 'تایید نهایی و امضا', user: 'کریمی - رئیس عمومی' }
        ]
      },
      {
        id: '2',
        docNumber: 'QT-PN-1402-0115',
        type: DocType.Pishnehad,
        title: 'تدارکات ماشین‌آلات سنگین',
        sender: 'مدیریت لوژستیک',
        receiver: 'مدیریت تدارکات',
        date: '۱۴۰۲/۰۹/۱۵',
        status: DocStatus.Pending,
        priority: 'CRITICAL',
        description: 'پیشنهاد خریداری ۱۰ عراده بیل مکانیکی جدید.',
        actionsTaken: 'در حال بررسی منابع مالی و مشخصات تخنیکی.',
        estimatedCost: 45000000,
        branch: Branch.Procurement,
        isQuoted: true,
        attachments: [{ id: 'att-1', name: 'Proposal_Draft.pdf', type: 'application/pdf', size: '1.2 MB', url: '#' }],
        history: [{ from: 'لوژستیک', to: 'تدارکات', timestamp: '۱۴۰۲/۰۹/۱۵', action: 'ارسال پیشنهاد خرید', user: 'محمدی - مدیر لوژستیک' }]
      }
    ];
    setDocs(initialDocs);
  }, []);

  const addNotification = (title: string, message: string, docId?: string) => {
    const newNote: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'fa-AF'),
      read: false,
      docId
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const addDocument = (newDoc: Omit<AppDocument, 'id' | 'status'>) => {
    const docId = Math.random().toString(36).substr(2, 9);
    const doc: AppDocument = {
      ...newDoc,
      id: docId,
      status: DocStatus.Pending,
      history: newDoc.history || []
    } as AppDocument;
    
    if (doc.type === DocType.Pishnehad) {
      addNotification("سند جدید در تدارکات", `پیشنهاد جدید "${doc.title}" به بخش تدارکات ارجاع شد.`, docId);
    }

    setDocs([doc, ...docs]);
  };

  const updateDocStatus = (id: string, status: DocStatus, reason?: string, reasons?: string[]) => {
    setDocs(docs.map(d => {
      if (d.id === id) {
        if (status === DocStatus.Rejected) {
          addNotification("سند مسترد شد", `سند "${d.title}" توسط واحد کنترول مسترد گردید.`, id);
        } else if (status === DocStatus.Approved) {
          addNotification("سند تایید شد", `سند "${d.title}" با موفقیت تایید نهایی شد.`, id);
        }
        return { ...d, status, rejectionReason: reason, rejectionReasons: reasons };
      }
      return d;
    }));
  };

  if (!user) {
    return <LoginView onLogin={setUser} lang={lang} setLang={setLang} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard docs={docs} lang={lang} user={user} />;
      case 'administrative': return <AdministrativeView docs={docs} addDoc={addDocument} lang={lang} />;
      case 'procurement': return <ProcurementView docs={docs} addDoc={addDocument} lang={lang} />;
      case 'finance': return <FinancialView docs={docs} lang={lang} />;
      case 'control': return <ControlView docs={docs} onUpdate={updateDocStatus} lang={lang} />;
      case 'assets': return <AssetView docs={docs} lang={lang} />;
      case 'reports': return <ReportsView docs={docs} lang={lang} />;
      default: return <Dashboard docs={docs} lang={lang} user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0a1a] text-slate-100" dir={lang === 'dr' || lang === 'ps' || lang === 'fa' ? 'rtl' : 'ltr'}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        user={user} 
        lang={lang} 
        onLogout={() => setUser(null)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          lang={lang} 
          setLang={setLang} 
          docs={docs}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
