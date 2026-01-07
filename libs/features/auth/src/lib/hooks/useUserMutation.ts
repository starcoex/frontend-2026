import { useAuth } from './useAuth';
import { useCallback } from 'react';
import {
  InviteUserInput,
  UpdateUserByAdminInput,
} from '@starcoex-frontend/graphql';

export const useUserMutations = (onSuccess?: () => void) => {
  const {
    updateUserByAdmin,
    deleteUserByAdmin,
    inviteUser,
    cancelInvitation,
    resendInvitation,
  } = useAuth();

  // 사용자 정보 수정
  const updateUser = useCallback(
    async (id: number, input: UpdateUserByAdminInput) => {
      const response = await updateUserByAdmin(id, input);
      if (response.success) {
        onSuccess?.();
      }
      return response;
    },
    [updateUserByAdmin, onSuccess]
  );

  // 사용자 삭제
  const deleteUser = useCallback(
    async (id: number) => {
      const response = await deleteUserByAdmin(id);
      if (response.success) {
        onSuccess?.();
      }
      return response;
    },
    [deleteUserByAdmin, onSuccess]
  );

  // 사용자 초대
  const invite = useCallback(
    async (input: InviteUserInput) => {
      const response = await inviteUser(input);
      if (response.success) {
        onSuccess?.();
      }
      return response;
    },
    [inviteUser, onSuccess]
  );

  // 초대 취소
  const cancelInvite = useCallback(
    async (invitationId: number) => {
      const response = await cancelInvitation(invitationId);
      if (response.success) {
        onSuccess?.();
      }
      return response;
    },
    [cancelInvitation, onSuccess]
  );

  // 초대 재발송
  const resendInvite = useCallback(
    async (invitationId: number) => {
      const response = await resendInvitation(invitationId);
      if (response.success) {
        onSuccess?.();
      }
      return response;
    },
    [resendInvitation, onSuccess]
  );

  return {
    updateUser,
    deleteUser,
    inviteUser: invite,
    cancelInvitation: cancelInvite,
    resendInvitation: resendInvite,
  };
};
