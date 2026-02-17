
export type Language = 'dr' | 'ps' | 'fa';

export enum Branch {
  Admin = 'ADMIN',
  Procurement = 'PROCUREMENT',
  Assets = 'ASSETS',
  Transport = 'TRANSPORT',
  Finance = 'FINANCE',
  Control = 'CONTROL',
  Invoice = 'INVOICE',
  GeneralManager = 'GENERAL_MANAGER'
}

export enum DocType {
  Maktoob = 'MAKTOOB',
  Pishnehad = 'PISHNEHAD',
  Estelam = 'ESTELAM',
  Invoice = 'INVOICE',
  M7 = 'M7',
  M16 = 'M16'
}

export enum DocStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Archived = 'ARCHIVED'
}

export interface DocHistory {
  from: string;
  to: string;
  timestamp: string;
  action: string;
  user?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface AppDocument {
  id: string;
  docNumber: string;
  inquiryNumber?: string;
  type: DocType;
  title: string;
  sender: string;
  receiver: string;
  date: string;
  status: DocStatus;
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL';
  summary?: string;
  description: string;
  actionsTaken: string;
  estimatedCost?: number;
  grossAmount?: number;
  contractor?: string;
  contractorContact?: string;
  contractorAddress?: string;
  isQuoted?: boolean;
  isContracted?: boolean;
  isInvoiceApproved?: boolean;
  rejectionReason?: string;
  rejectionReasons?: string[];
  branch: Branch;
  isResponseReceived?: boolean;
  responseDate?: string;
  responseSummary?: string;
  hasAttachments?: boolean;
  attachments?: Attachment[];
  history?: DocHistory[];
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Branch;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  docId?: string;
}
