import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  SUBMIT_CONTACT,
  SUBMIT_CONTACT_REPLY,
  UPDATE_CONTACT,
  UPDATE_CONTACT_STATUS,
  DELETE_CONTACT,
  BULK_DELETE_CONTACTS,
  UPDATE_CONTACT_REPLY,
  DELETE_CONTACT_REPLY,
  GET_CONTACT,
  GET_MY_CONTACTS,
  ADMIN_CONTACTS,
  CONTACT_STATS,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  IContactsService,
  ContactStatsOutput,
  GetContactsOutput,
  GetContactOutput,
  SubmitContactInput,
  SubmitContactOutput,
  SubmitContactReplyOutput,
  SubmitContactReplyInput,
  UpdateContactInput,
  UpdateContactOutput,
  UpdateContactStatusInput,
  UpdateContactStatusOutput,
  DeleteContactInput,
  DeleteContactOutput,
  BulkDeleteContactInput,
  BulkDeleteContactOutput,
  UpdateContactReplyInput,
  UpdateContactReplyOutput,
  DeleteContactReplyInput,
  DeleteContactReplyOutput,
  GetContactsInput,
  ApiResponse,
} from '../types';

export class ContactsService implements IContactsService {
  constructor(private client: ApolloClient) {}

  // ─── 공통 헬퍼 ──────────────────────────────────────────────────────────────

  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });
      const { data, error, extensions } = result as any;
      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          extensions: extensions ?? {},
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }
      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });
      if (error) {
        const gqlError: GraphQLFormattedError = {
          message:
            (error as any).message ?? '요청 처리 중 오류가 발생했습니다.',
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }
      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ─── Queries ─────────────────────────────────────────────────────────────────

  async getContact(contactId: string): Promise<ApiResponse<GetContactOutput>> {
    const res = await this.query<{ getContact: GetContactOutput }>(
      GET_CONTACT,
      {
        contactId,
      }
    );
    if (res.success && res.data?.getContact) {
      return { success: true, data: res.data.getContact };
    }
    return res as unknown as ApiResponse<GetContactOutput>;
  }

  async getMyContacts(
    limit = 20,
    offset = 0
  ): Promise<ApiResponse<GetContactsOutput>> {
    const res = await this.query<{ myContacts: GetContactsOutput }>(
      GET_MY_CONTACTS,
      { limit, offset }
    );
    if (res.success && res.data?.myContacts) {
      return { success: true, data: res.data.myContacts };
    }
    return res as unknown as ApiResponse<GetContactsOutput>;
  }

  async adminContacts(
    input?: GetContactsInput
  ): Promise<ApiResponse<GetContactsOutput>> {
    const res = await this.query<{ adminContacts: GetContactsOutput }>(
      ADMIN_CONTACTS,
      { input }
    );
    if (res.success && res.data?.adminContacts) {
      return { success: true, data: res.data.adminContacts };
    }
    return res as unknown as ApiResponse<GetContactsOutput>;
  }

  async contactStats(): Promise<ApiResponse<ContactStatsOutput>> {
    const res = await this.query<{ contactStats: ContactStatsOutput }>(
      CONTACT_STATS
    );
    if (res.success && res.data?.contactStats) {
      return { success: true, data: res.data.contactStats };
    }
    return res as unknown as ApiResponse<ContactStatsOutput>;
  }

  // ─── Mutations ────────────────────────────────────────────────────────────────

  async submitContact(
    input: SubmitContactInput
  ): Promise<ApiResponse<SubmitContactOutput>> {
    const res = await this.mutate<{ submitContact: SubmitContactOutput }>(
      SUBMIT_CONTACT,
      { input }
    );
    if (res.success && res.data?.submitContact) {
      return { success: true, data: res.data.submitContact };
    }
    return res as unknown as ApiResponse<SubmitContactOutput>;
  }

  async submitContactReply(
    input: SubmitContactReplyInput
  ): Promise<ApiResponse<SubmitContactReplyOutput>> {
    const res = await this.mutate<{
      submitContactReply: SubmitContactReplyOutput;
    }>(SUBMIT_CONTACT_REPLY, { input });
    if (res.success && res.data?.submitContactReply) {
      return { success: true, data: res.data.submitContactReply };
    }
    return res as unknown as ApiResponse<SubmitContactReplyOutput>;
  }

  async updateContact(
    input: UpdateContactInput
  ): Promise<ApiResponse<UpdateContactOutput>> {
    const res = await this.mutate<{ updateContact: UpdateContactOutput }>(
      UPDATE_CONTACT,
      { input }
    );
    if (res.success && res.data?.updateContact) {
      return { success: true, data: res.data.updateContact };
    }
    return res as unknown as ApiResponse<UpdateContactOutput>;
  }

  async updateContactStatus(
    input: UpdateContactStatusInput
  ): Promise<ApiResponse<UpdateContactStatusOutput>> {
    const res = await this.mutate<{
      updateContactStatus: UpdateContactStatusOutput;
    }>(UPDATE_CONTACT_STATUS, { input });
    if (res.success && res.data?.updateContactStatus) {
      return { success: true, data: res.data.updateContactStatus };
    }
    return res as unknown as ApiResponse<UpdateContactStatusOutput>;
  }

  async deleteContact(
    input: DeleteContactInput
  ): Promise<ApiResponse<DeleteContactOutput>> {
    const res = await this.mutate<{ deleteContact: DeleteContactOutput }>(
      DELETE_CONTACT,
      { input }
    );
    if (res.success && res.data?.deleteContact) {
      return { success: true, data: res.data.deleteContact };
    }
    return res as unknown as ApiResponse<DeleteContactOutput>;
  }

  async bulkDeleteContacts(
    input: BulkDeleteContactInput
  ): Promise<ApiResponse<BulkDeleteContactOutput>> {
    const res = await this.mutate<{
      bulkDeleteContacts: BulkDeleteContactOutput;
    }>(BULK_DELETE_CONTACTS, { input });
    if (res.success && res.data?.bulkDeleteContacts) {
      return { success: true, data: res.data.bulkDeleteContacts };
    }
    return res as unknown as ApiResponse<BulkDeleteContactOutput>;
  }

  async updateContactReply(
    input: UpdateContactReplyInput
  ): Promise<ApiResponse<UpdateContactReplyOutput>> {
    const res = await this.mutate<{
      updateContactReply: UpdateContactReplyOutput;
    }>(UPDATE_CONTACT_REPLY, { input });
    if (res.success && res.data?.updateContactReply) {
      return { success: true, data: res.data.updateContactReply };
    }
    return res as unknown as ApiResponse<UpdateContactReplyOutput>;
  }

  async deleteContactReply(
    input: DeleteContactReplyInput
  ): Promise<ApiResponse<DeleteContactReplyOutput>> {
    const res = await this.mutate<{
      deleteContactReply: DeleteContactReplyOutput;
    }>(DELETE_CONTACT_REPLY, { input });
    if (res.success && res.data?.deleteContactReply) {
      return { success: true, data: res.data.deleteContactReply };
    }
    return res as unknown as ApiResponse<DeleteContactReplyOutput>;
  }
}
