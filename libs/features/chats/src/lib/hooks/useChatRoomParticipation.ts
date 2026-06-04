import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useChats } from '../hooks';

interface UseChatRoomParticipationOptions {
  roomId: number;
  createdByUserId?: number | null;
  currentUserId?: number;
  currentUserName?: string;
  currentUserEmail?: string;
  onLeaveSuccess: () => void;
}

export function useChatRoomParticipation({
  roomId,
  createdByUserId,
  currentUserId,
  currentUserName,
  currentUserEmail,
  onLeaveSuccess,
}: UseChatRoomParticipationOptions) {
  const {
    currentParticipants,
    fetchChatParticipants,
    fetchChatMessages,
    joinChatRoom,
    leaveChatRoom,
    updateChatRoomStatus,
  } = useChats();

  const [isParticipant, setIsParticipant] = useState(false);
  const [hasLeft, setHasLeft] = useState(false); // ✅ 재참여 배너용
  const [myParticipantId, setMyParticipantId] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [participantCheckDone, setParticipantCheckDone] = useState(false);

  const isCheckingRef = useRef(false);
  const displayLabel = currentUserName ?? currentUserEmail ?? '상담원';

  // ── 참여 확인 ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !currentParticipants.length ||
      !currentUserId ||
      participantCheckDone ||
      isCheckingRef.current
    )
      return;

    isCheckingRef.current = true;

    const run = async () => {
      try {
        const myParticipants = currentParticipants.filter(
          (p) => p.userId === currentUserId
        );

        // 활성 참여자 먼저 확인 (leftAt 없는 것)
        const activeParticipant = myParticipants.find((p) => !p.leftAt);

        // CASE 1: 활성 참여자
        if (activeParticipant) {
          console.info(
            '[Participation] CASE1 활성 참여자:',
            activeParticipant.id
          );
          setMyParticipantId(activeParticipant.id);
          setIsParticipant(true);
          setParticipantCheckDone(true);
          return;
        }

        // CASE 2: 방장 → 자동 재참여 (나간 상태여도)
        if (createdByUserId === currentUserId) {
          console.info('[Participation] CASE2 방장 자동 참여');
          const res = await joinChatRoom({
            roomId,
            role: 'SUPPORT_AGENT',
            notificationEnabled: true,
            displayName: currentUserName,
            joinMessage: `${displayLabel}님이 채팅방에 참여했습니다.`,
          });
          if (res.success && res.data?.participant) {
            console.info(
              '[Participation] CASE2 성공:',
              res.data.participant.id
            );
            setMyParticipantId(res.data.participant.id);
            setIsParticipant(true);
            await fetchChatParticipants(roomId, { includeLeft: true });
          } else {
            console.error('[Participation] CASE2 실패:', res.error);
          }
          setParticipantCheckDone(true);
          return;
        }

        // CASE 3: 일반 사용자 — 나간 적 있음 → 재참여 배너
        const leftParticipant = myParticipants.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        )[0];

        if (leftParticipant && leftParticipant.leftAt) {
          console.info('[Participation] CASE3 이전에 나간 상태 → 재참여 배너');
          setMyParticipantId(leftParticipant.id);
          setHasLeft(true);
          setParticipantCheckDone(true);
          return;
        }

        // CASE 4: 완전 미참여자
        console.info('[Participation] CASE4 미참여');
        setParticipantCheckDone(true);
      } finally {
        isCheckingRef.current = false;
      }
    };

    run();
  }, [currentParticipants, currentUserId, participantCheckDone]);

  // ── 수동 참여 (최초 참여 + 재참여 버튼 클릭) ──────────────────────────────
  const handleJoinRoom = useCallback(
    async (roomStatus?: string) => {
      setIsJoining(true);
      try {
        const joinMsg = hasLeft
          ? `${displayLabel}님이 채팅방에 다시 참여했습니다.`
          : `${displayLabel}님이 채팅방에 참여했습니다.`;

        const res = await joinChatRoom({
          roomId,
          role: 'SUPPORT_AGENT',
          notificationEnabled: true,
          displayName: currentUserName,
          joinMessage: joinMsg,
        });
        if (res.success && res.data?.participant) {
          console.info(
            '[Participation] 수동 참여 성공:',
            res.data.participant.id
          );
          setMyParticipantId(res.data.participant.id);
          setIsParticipant(true);
          setHasLeft(false);
          toast.success(res.data.message ?? '채팅방에 참여했습니다.');
          await fetchChatParticipants(roomId, { includeLeft: true });
          // ✅ 재참여 후 메시지 재조회 (joinMessage 시스템 메시지 포함)
          await fetchChatMessages({ roomId });
          if (roomStatus === 'WAITING') {
            await updateChatRoomStatus(roomId, 'IN_PROGRESS');
          }
        } else {
          toast.error(res.error?.message ?? '채팅방 참여에 실패했습니다.');
        }
      } finally {
        setIsJoining(false);
      }
    },
    [roomId, currentUserName, displayLabel, hasLeft]
  );

  // ── 나가기 ─────────────────────────────────────────────────────────────────
  const handleLeaveRoom = useCallback(async () => {
    if (!myParticipantId) {
      toast.error('참여자 정보를 찾을 수 없습니다.');
      return;
    }
    setIsLeaving(true);
    try {
      const res = await leaveChatRoom(myParticipantId, roomId);
      if (res.success) {
        console.info('[Participation] 나가기 성공');
        toast.success('채팅방을 나갔습니다.');
        setMyParticipantId(null);
        setIsParticipant(false);
        onLeaveSuccess();
      } else {
        toast.error(res.error?.message ?? '채팅방 나가기에 실패했습니다.');
      }
    } finally {
      setIsLeaving(false);
    }
  }, [myParticipantId, roomId, displayLabel]);

  // ── 초기화 ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setIsParticipant(false);
    setHasLeft(false);
    setMyParticipantId(null);
    setParticipantCheckDone(false);
    isCheckingRef.current = false;
  }, []);

  return {
    isParticipant,
    hasLeft, // ✅ 재참여 배너용
    myParticipantId,
    isJoining,
    isLeaving,
    participantCheckDone,
    handleJoinRoom,
    handleLeaveRoom,
    reset,
  };
}
