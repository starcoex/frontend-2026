import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useContactsContext } from '../context';
import { getContactsService } from '../services';
import type {
  SubmitContactInput,
  SubmitContactReplyInput,
  UpdateContactInput,
  UpdateContactStatusInput,
  DeleteContactInput,
  BulkDeleteContactInput,
  UpdateContactReplyInput,
  DeleteContactReplyInput,
  GetContactsInput,
} from '../types';

export const useContacts = () => {
  const context = useContactsContext();

  const {
    setContacts,
    addContact,
    updateContactInContext,
    setCurrentContact,
    setLoading,
    setError,
    clearError,
    setTotalCount,
    isLoading: contextIsLoading,
    contacts,
    currentContact,
    filters,
    totalCount,
    hasNextPage,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // ─── 공통 로딩 래퍼 ────────────────────────────────────────────────────────

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ─── Queries ──────────────────────────────────────────────────────────────

  const fetchMyContacts = useCallback(
    async (limit = 20, offset = 0) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.getMyContacts(limit, offset);
        if (res.success && res.data) {
          setContacts(res.data.contacts);
          setTotalCount(res.data.totalCount);
        }
        return res;
      }, '내 문의 목록을 불러오는데 실패했습니다.'),
    [withLoading, setContacts, setTotalCount]
  );

  const fetchAdminContacts = useCallback(
    async (input?: GetContactsInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.adminContacts(input);
        if (res.success && res.data) {
          setContacts(res.data.contacts);
          setTotalCount(res.data.totalCount);
        }
        return res;
      }, '문의 목록을 불러오는데 실패했습니다.'),
    [withLoading, setContacts, setTotalCount]
  );

  const fetchContact = useCallback(
    async (contactId: string) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.getContact(contactId);
        if (res.success && res.data?.contact) {
          setCurrentContact(res.data.contact);
        }
        return res;
      }, '문의 내용을 불러오는데 실패했습니다.'),
    [withLoading, setCurrentContact]
  );

  const fetchContactStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getContactsService();
        return service.contactStats();
      }, '문의 통계를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ─── Mutations ────────────────────────────────────────────────────────────

  const submitContact = useCallback(
    async (input: SubmitContactInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.submitContact(input);
        if (res.success && res.data?.contact) {
          addContact(res.data.contact);
        }
        return res;
      }, '문의 접수에 실패했습니다.'),
    [withLoading, addContact]
  );

  const submitContactReply = useCallback(
    async (input: SubmitContactReplyInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.submitContactReply(input);
        if (res.success && res.data?.reply) {
          const contactId = Number(input.contactId);
          const contact = contacts.find((c) => c.id === contactId);
          if (contact) {
            updateContactInContext(contactId, {
              replies: [...contact.replies, res.data.reply],
            });
          }
        }
        return res;
      }, '답변 등록에 실패했습니다.'),
    [withLoading, contacts, updateContactInContext]
  );

  const updateContact = useCallback(
    async (input: UpdateContactInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.updateContact(input);
        if (res.success && res.data?.contact) {
          updateContactInContext(res.data.contact.id, res.data.contact);
        }
        return res;
      }, '문의 수정에 실패했습니다.'),
    [withLoading, updateContactInContext]
  );

  const updateContactStatus = useCallback(
    async (input: UpdateContactStatusInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.updateContactStatus(input);
        if (res.success && res.data?.contact) {
          updateContactInContext(res.data.contact.id, res.data.contact);
        }
        return res;
      }, '문의 상태 변경에 실패했습니다.'),
    [withLoading, updateContactInContext]
  );

  const deleteContact = useCallback(
    async (input: DeleteContactInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.deleteContact(input);
        if (res.success && res.data?.contactId) {
          const deletedId = Number(res.data.contactId);
          setContacts(contacts.filter((c) => c.id !== deletedId));
          if (currentContact?.id === deletedId) setCurrentContact(null);
        }
        return res;
      }, '문의 삭제에 실패했습니다.'),
    [withLoading, contacts, setContacts, currentContact, setCurrentContact]
  );

  const bulkDeleteContacts = useCallback(
    async (input: BulkDeleteContactInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.bulkDeleteContacts(input);
        if (res.success && res.data?.deletedIds) {
          const deletedNums = res.data.deletedIds.map(Number);
          setContacts(contacts.filter((c) => !deletedNums.includes(c.id)));
          if (currentContact && deletedNums.includes(currentContact.id)) {
            setCurrentContact(null);
          }
        }
        return res;
      }, '문의 다건 삭제에 실패했습니다.'),
    [withLoading, contacts, setContacts, currentContact, setCurrentContact]
  );

  const updateContactReply = useCallback(
    async (input: UpdateContactReplyInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.updateContactReply(input);
        if (res.success && res.data?.reply) {
          const reply = res.data.reply;
          const contactId = Number(reply.contactId);
          const contact = contacts.find((c) => c.id === contactId);
          if (contact) {
            updateContactInContext(contactId, {
              replies: contact.replies.map((r) =>
                r.id === reply.id ? reply : r
              ),
            });
          }
        }
        return res;
      }, '답변 수정에 실패했습니다.'),
    [withLoading, contacts, updateContactInContext]
  );

  const deleteContactReply = useCallback(
    async (input: DeleteContactReplyInput) =>
      withLoading(async () => {
        const service = getContactsService();
        const res = await service.deleteContactReply(input);
        if (res.success && res.data?.replyId) {
          const contactId = Number(input.contactId);
          const contact = contacts.find((c) => c.id === contactId);
          if (contact) {
            updateContactInContext(contactId, {
              replies: contact.replies.filter(
                (r) => r.id !== Number(res.data!.replyId)
              ),
            });
          }
        }
        return res;
      }, '답변 삭제에 실패했습니다.'),
    [withLoading, contacts, updateContactInContext]
  );

  // ─── 클라이언트 사이드 필터링 ─────────────────────────────────────────────

  const filteredContacts = useCallback(() => {
    let result = [...contacts];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.message.toLowerCase().includes(s) ||
          c.subject?.toLowerCase().includes(s)
      );
    }
    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.category) {
      result = result.filter((c) => c.category === filters.category);
    }
    if (filters.contactUserType) {
      result = result.filter(
        (c) => c.contactUserType === filters.contactUserType
      );
    }
    if (filters.startDate) {
      result = result.filter(
        (c) => new Date(c.createdAt) >= new Date(filters.startDate!)
      );
    }
    if (filters.endDate) {
      result = result.filter(
        (c) => new Date(c.createdAt) <= new Date(filters.endDate!)
      );
    }

    return result;
  }, [contacts, filters]);

  return {
    ...context,

    // Queries
    fetchMyContacts,
    fetchAdminContacts,
    fetchContact,
    fetchContactStats,
    filteredContacts,

    // Mutations
    submitContact,
    submitContactReply,
    updateContact,
    updateContactStatus,
    deleteContact,
    bulkDeleteContacts,
    updateContactReply,
    deleteContactReply,

    // 편의 값
    contacts,
    currentContact,
    filters,
    totalCount,
    hasNextPage,
  };
};
