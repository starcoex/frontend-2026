import type { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  ADMIN_CHAT_ROOMS,
  GET_MY_CHAT_ROOMS,
  GET_CHAT_ROOM,
  CHAT_ROOM_STATS,
  ADMIN_CHAT_MESSAGES,
  GET_CHAT_MESSAGES,
  CHAT_MESSAGE_STATS,
  GET_CHAT_PARTICIPANTS,
  CREATE_CHAT_ROOM,
  UPDATE_CHAT_ROOM_STATUS,
  DELETE_CHAT_ROOM,
  BULK_DELETE_CHAT_ROOMS,
  SEND_MESSAGE,
  MARK_MESSAGES_AS_READ,
  DELETE_MESSAGE,
  BULK_DELETE_MESSAGES,
  JOIN_CHAT_ROOM,
  LEAVE_CHAT_ROOM,
  UPDATE_ONLINE_STATUS,
  KICK_PARTICIPANT,
  UPDATE_PARTICIPANT_ROLE,
  UPDATE_NOTIFICATION_SETTINGS,
  UPDATE_CHAT_ROOM,
} from '@starcoex-frontend/graphql';
import type {
  ApiResponse,
  IChatService,
  ChatRoom,
  ChatParticipant,
  ChatRoomSummaryStats,
  ChatMessageSummaryStats,
  GetChatRoomsInput,
  GetChatRoomsOutput,
  GetMessagesInput,
  GetMessagesOutput,
  GetParticipantsInput,
  GetParticipantsOutput,
  CreateChatRoomInput,
  CreateChatRoomOutput,
  SendMessageInput,
  SendMessageOutput,
  JoinChatRoomInput,
  JoinChatRoomOutput,
  BulkDeleteChatRoomsOutput,
  BulkDeleteMessagesOutput,
  UpdateChatRoomInput,
} from '../types';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '@starcoex-frontend/delivery';

export class ChatService implements IChatService {
  constructor(private client: ApolloClient) {}

  // ============================================================================
  // 공통 헬퍼
  // ============================================================================

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

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
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
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
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

  // ============================================================================
  // Queries
  // ============================================================================

  async adminChatRooms(
    input?: GetChatRoomsInput
  ): Promise<ApiResponse<GetChatRoomsOutput>> {
    const res = await this.query<{ adminChatRooms: GetChatRoomsOutput }>(
      ADMIN_CHAT_ROOMS,
      { input }
    );
    if (res.success && res.data?.adminChatRooms) {
      return { success: true, data: res.data.adminChatRooms };
    }
    return res as unknown as ApiResponse<GetChatRoomsOutput>;
  }

  async getMyChatRooms(
    input?: GetChatRoomsInput
  ): Promise<ApiResponse<GetChatRoomsOutput>> {
    const res = await this.query<{ getMyChatRooms: GetChatRoomsOutput }>(
      GET_MY_CHAT_ROOMS,
      { input }
    );
    if (res.success && res.data?.getMyChatRooms) {
      return { success: true, data: res.data.getMyChatRooms };
    }
    return res as unknown as ApiResponse<GetChatRoomsOutput>;
  }

  async getChatRoom(roomId: number): Promise<ApiResponse<ChatRoom>> {
    const res = await this.query<{ getChatRoom: ChatRoom }>(GET_CHAT_ROOM, {
      roomId,
    });
    if (res.success && res.data?.getChatRoom) {
      return { success: true, data: res.data.getChatRoom };
    }
    return res as unknown as ApiResponse<ChatRoom>;
  }

  async chatRoomStats(): Promise<ApiResponse<ChatRoomSummaryStats>> {
    const res = await this.query<{ chatRoomStats: ChatRoomSummaryStats }>(
      CHAT_ROOM_STATS
    );
    if (res.success && res.data?.chatRoomStats) {
      return { success: true, data: res.data.chatRoomStats };
    }
    return res as unknown as ApiResponse<ChatRoomSummaryStats>;
  }

  async adminChatMessages(
    input: GetMessagesInput
  ): Promise<ApiResponse<GetMessagesOutput>> {
    const res = await this.query<{ adminChatMessages: GetMessagesOutput }>(
      ADMIN_CHAT_MESSAGES,
      { input }
    );
    if (res.success && res.data?.adminChatMessages) {
      return { success: true, data: res.data.adminChatMessages };
    }
    return res as unknown as ApiResponse<GetMessagesOutput>;
  }

  async getChatMessages(
    input: GetMessagesInput
  ): Promise<ApiResponse<GetMessagesOutput>> {
    const res = await this.query<{ getChatMessages: GetMessagesOutput }>(
      GET_CHAT_MESSAGES,
      { input }
    );
    if (res.success && res.data?.getChatMessages) {
      return { success: true, data: res.data.getChatMessages };
    }
    return res as unknown as ApiResponse<GetMessagesOutput>;
  }

  async chatMessageStats(): Promise<ApiResponse<ChatMessageSummaryStats>> {
    const res = await this.query<{ chatMessageStats: ChatMessageSummaryStats }>(
      CHAT_MESSAGE_STATS
    );
    if (res.success && res.data?.chatMessageStats) {
      return { success: true, data: res.data.chatMessageStats };
    }
    return res as unknown as ApiResponse<ChatMessageSummaryStats>;
  }

  async getChatParticipants(
    roomId: number,
    input?: Omit<GetParticipantsInput, 'roomId'>
  ): Promise<ApiResponse<GetParticipantsOutput>> {
    const res = await this.query<{
      getChatParticipants: GetParticipantsOutput;
    }>(GET_CHAT_PARTICIPANTS, {
      roomId,
      input: input ? { roomId, ...input } : { roomId },
    });
    if (res.success && res.data?.getChatParticipants) {
      return { success: true, data: res.data.getChatParticipants };
    }
    return res as unknown as ApiResponse<GetParticipantsOutput>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createChatRoom(
    input: CreateChatRoomInput
  ): Promise<ApiResponse<CreateChatRoomOutput>> {
    const res = await this.mutate<{ createChatRoom: CreateChatRoomOutput }>(
      CREATE_CHAT_ROOM,
      { input }
    );
    if (res.success && res.data?.createChatRoom) {
      return { success: true, data: res.data.createChatRoom };
    }
    return res as unknown as ApiResponse<CreateChatRoomOutput>;
  }

  // ── 신규: updateChatRoom ────────────────────────────────────────────────────
  async updateChatRoom(
    input: UpdateChatRoomInput
  ): Promise<ApiResponse<ChatRoom>> {
    const res = await this.mutate<{ updateChatRoom: ChatRoom }>(
      UPDATE_CHAT_ROOM,
      { input }
    );
    if (res.success && res.data?.updateChatRoom) {
      return { success: true, data: res.data.updateChatRoom };
    }
    return res as unknown as ApiResponse<ChatRoom>;
  }

  async updateChatRoomStatus(
    roomId: number,
    status: string
  ): Promise<ApiResponse<ChatRoom>> {
    const res = await this.mutate<{ updateChatRoomStatus: ChatRoom }>(
      UPDATE_CHAT_ROOM_STATUS,
      { roomId, status }
    );
    if (res.success && res.data?.updateChatRoomStatus) {
      return { success: true, data: res.data.updateChatRoomStatus };
    }
    return res as unknown as ApiResponse<ChatRoom>;
  }

  async deleteChatRoom(
    roomId: number,
    hardDelete = false
  ): Promise<ApiResponse<string>> {
    const res = await this.mutate<{ deleteChatRoom: string }>(
      DELETE_CHAT_ROOM,
      {
        roomId,
        hardDelete,
      }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteChatRoom };
    }
    return res as unknown as ApiResponse<string>;
  }

  async bulkDeleteChatRooms(
    ids: number[],
    hardDelete = false
  ): Promise<ApiResponse<BulkDeleteChatRoomsOutput>> {
    const res = await this.mutate<{
      bulkDeleteChatRooms: BulkDeleteChatRoomsOutput;
    }>(BULK_DELETE_CHAT_ROOMS, { ids, hardDelete });
    if (res.success && res.data?.bulkDeleteChatRooms) {
      return { success: true, data: res.data.bulkDeleteChatRooms };
    }
    return res as unknown as ApiResponse<BulkDeleteChatRoomsOutput>;
  }

  async sendMessage(
    input: SendMessageInput
  ): Promise<ApiResponse<SendMessageOutput>> {
    const res = await this.mutate<{ sendMessage: SendMessageOutput }>(
      SEND_MESSAGE,
      { input }
    );
    if (res.success && res.data?.sendMessage) {
      return { success: true, data: res.data.sendMessage };
    }
    return res as unknown as ApiResponse<SendMessageOutput>;
  }

  async markMessagesAsRead(
    roomId: number,
    messageIds: number[]
  ): Promise<ApiResponse<number>> {
    const res = await this.mutate<{ markMessagesAsRead: number }>(
      MARK_MESSAGES_AS_READ,
      { roomId, messageIds }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.markMessagesAsRead };
    }
    return res as unknown as ApiResponse<number>;
  }

  async deleteMessage(
    messageId: number,
    hardDelete = false
  ): Promise<ApiResponse<string>> {
    const res = await this.mutate<{ deleteMessage: string }>(DELETE_MESSAGE, {
      messageId,
      hardDelete,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteMessage };
    }
    return res as unknown as ApiResponse<string>;
  }

  async bulkDeleteMessages(
    messageIds: number[],
    hardDelete = false
  ): Promise<ApiResponse<BulkDeleteMessagesOutput>> {
    const res = await this.mutate<{
      bulkDeleteMessages: BulkDeleteMessagesOutput;
    }>(BULK_DELETE_MESSAGES, { messageIds, hardDelete });
    if (res.success && res.data?.bulkDeleteMessages) {
      return { success: true, data: res.data.bulkDeleteMessages };
    }
    return res as unknown as ApiResponse<BulkDeleteMessagesOutput>;
  }

  async joinChatRoom(
    input: JoinChatRoomInput
  ): Promise<ApiResponse<JoinChatRoomOutput>> {
    const res = await this.mutate<{ joinChatRoom: JoinChatRoomOutput }>(
      JOIN_CHAT_ROOM,
      { input }
    );
    if (res.success && res.data?.joinChatRoom) {
      return { success: true, data: res.data.joinChatRoom };
    }
    return res as unknown as ApiResponse<JoinChatRoomOutput>;
  }

  async leaveChatRoom(participantId: number): Promise<ApiResponse<string>> {
    const res = await this.mutate<{ leaveChatRoom: string }>(LEAVE_CHAT_ROOM, {
      participantId,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.leaveChatRoom };
    }
    return res as unknown as ApiResponse<string>;
  }

  async updateOnlineStatus(
    participantId: number,
    isOnline: boolean
  ): Promise<ApiResponse<ChatParticipant>> {
    const res = await this.mutate<{ updateOnlineStatus: ChatParticipant }>(
      UPDATE_ONLINE_STATUS,
      { participantId, isOnline }
    );
    if (res.success && res.data?.updateOnlineStatus) {
      return { success: true, data: res.data.updateOnlineStatus };
    }
    return res as unknown as ApiResponse<ChatParticipant>;
  }

  async kickParticipant(
    participantId: number,
    reason?: string
  ): Promise<ApiResponse<string>> {
    const res = await this.mutate<{ kickParticipant: string }>(
      KICK_PARTICIPANT,
      {
        participantId,
        reason,
      }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.kickParticipant };
    }
    return res as unknown as ApiResponse<string>;
  }

  async updateParticipantRole(
    participantId: number,
    newRole: string
  ): Promise<ApiResponse<ChatParticipant>> {
    const res = await this.mutate<{ updateParticipantRole: ChatParticipant }>(
      UPDATE_PARTICIPANT_ROLE,
      { participantId, newRole }
    );
    if (res.success && res.data?.updateParticipantRole) {
      return { success: true, data: res.data.updateParticipantRole };
    }
    return res as unknown as ApiResponse<ChatParticipant>;
  }

  async updateNotificationSettings(
    participantId: number,
    notificationEnabled: boolean
  ): Promise<ApiResponse<ChatParticipant>> {
    const res = await this.mutate<{
      updateNotificationSettings: ChatParticipant;
    }>(UPDATE_NOTIFICATION_SETTINGS, { participantId, notificationEnabled });
    if (res.success && res.data?.updateNotificationSettings) {
      return { success: true, data: res.data.updateNotificationSettings };
    }
    return res as unknown as ApiResponse<ChatParticipant>;
  }
}
