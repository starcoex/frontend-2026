export enum ReplyAuthorType {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
  SYSTEM = 'SYSTEM',
}

export enum ContactUserType {
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export enum ContactCategory {
  GENERAL = 'GENERAL',
  TECHNICAL = 'TECHNICAL',
  PAYMENT = 'PAYMENT',
  PARTNERSHIP = 'PARTNERSHIP',
  COMPLAINT = 'COMPLAINT',
  ETC = 'ETC',
}

export enum ContactStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// ─── Entities ────────────────────────────────────────────────────────────────

export interface ContactReply {
  id: number;
  contactId: string;
  authorId?: number;
  authorType: ReplyAuthorType;
  authorName: string;
  message: string;
  attachments: string[];
  isInternal: boolean;
  notified: boolean;
  notifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  userId?: number;
  contactUserType: ContactUserType;
  category: ContactCategory;
  subject?: string;
  message: string;
  agreedToTerms: boolean;
  status: ContactStatus;
  assignedTo?: number;
  assignedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  adminNote?: string;
  ipAddress?: string;
  sourceApp?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  replies: ContactReply[];
}

// ─── Inputs ───────────────────────────────────────────────────────────────────

export interface SubmitContactInput {
  name: string;
  email: string;
  phone?: string;
  category?: ContactCategory;
  subject?: string;
  message: string;
  agreedToTerms: boolean;
  sourceApp?: string;
}

export interface SubmitContactReplyInput {
  contactId: string;
  message: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface UpdateContactInput {
  contactId: string;
  status?: ContactStatus;
  category?: ContactCategory;
  assignedTo?: number;
  adminNote?: string;
}

export interface UpdateContactStatusInput {
  contactId: string;
  status: ContactStatus;
  assignedTo?: number;
  adminNote?: string;
}

export interface DeleteContactInput {
  contactId: string;
}

export interface BulkDeleteContactInput {
  contactIds: string[];
}

export interface UpdateContactReplyInput {
  replyId: string;
  message?: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface DeleteContactReplyInput {
  replyId: string;
  contactId: string;
}

export interface GetContactsInput {
  limit?: number;
  offset?: number;
  status?: ContactStatus;
  category?: ContactCategory;
  contactUserType?: ContactUserType;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// ─── Outputs ─────────────────────────────────────────────────────────────────

export interface ErrorInfo {
  code?: string;
  message: string;
  details?: string;
}

export interface SubmitContactOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  contact?: Contact;
}

export interface SubmitContactReplyOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  reply?: ContactReply;
}

export interface GetContactsOutput {
  success?: boolean;
  error?: ErrorInfo;
  contacts: Contact[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface GetContactOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  contact?: Contact;
}

export interface UpdateContactStatusOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  contact?: Contact;
}

export interface UpdateContactOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  contact?: Contact;
}

export interface DeleteContactOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  contactId: string;
}

export interface BulkDeleteContactOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  deletedIds: string[];
  deletedCount: number;
}

export interface UpdateContactReplyOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  reply?: ContactReply;
}

export interface DeleteContactReplyOutput {
  success?: boolean;
  message: string;
  error?: ErrorInfo;
  replyId: string;
}

export interface ContactStatsOutput {
  success?: boolean;
  error?: ErrorInfo;
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  todayCount: number;
  thisWeekCount: number;
  thisMonthCount: number;
  memberCount: number;
  guestCount: number;
  resolvedRate: number;
}

// ─── State & Context ──────────────────────────────────────────────────────────

export interface ContactFilters {
  search?: string;
  status?: ContactStatus;
  category?: ContactCategory;
  contactUserType?: ContactUserType;
  startDate?: string;
  endDate?: string;
}

export interface ContactsState {
  contacts: Contact[];
  currentContact: Contact | null;
  filters: ContactFilters;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  hasNextPage: boolean;
}

export interface IContactsService {
  getContact(contactId: string): Promise<any>;
  getMyContacts(limit?: number, offset?: number): Promise<any>;
  adminContacts(input?: GetContactsInput): Promise<any>;
  contactStats(): Promise<any>;
  submitContact(input: SubmitContactInput): Promise<any>;
  submitContactReply(input: SubmitContactReplyInput): Promise<any>;
  updateContact(input: UpdateContactInput): Promise<any>;
  updateContactStatus(input: UpdateContactStatusInput): Promise<any>;
  deleteContact(input: DeleteContactInput): Promise<any>;
  bulkDeleteContacts(input: BulkDeleteContactInput): Promise<any>;
  updateContactReply(input: UpdateContactReplyInput): Promise<any>;
  deleteContactReply(input: DeleteContactReplyInput): Promise<any>;
}

export interface ContactsContextValue extends ContactsState {
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContactInContext: (id: number, updates: Partial<Contact>) => void;
  setCurrentContact: (contact: Contact | null) => void;
  setFilters: (filters: Partial<ContactFilters>) => void;
  clearFilters: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setTotalCount: (count: number) => void;
  reset: () => void;
}
