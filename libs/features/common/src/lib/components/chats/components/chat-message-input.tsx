import { Images, Loader2, Paperclip, Search, Send } from 'lucide-react';
import React from 'react';

export interface ChatMessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onUpload?: () => void;
  onLibrary?: () => void;
  onToggleSearch?: () => void;
  isSearchOpen?: boolean;
  isParticipant: boolean;
  isSending: boolean;
  InputComponent: React.ComponentType<
    React.InputHTMLAttributes<HTMLInputElement>
  >;
  ButtonComponent: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      size?: string;
      variant?: string;
      asChild?: boolean;
    }
  >;
  /** 툴팁 래퍼 (없으면 단순 렌더) */
  TooltipWrapper?: React.ComponentType<{
    label: string;
    children: React.ReactNode;
  }>;
}

export function ChatMessageInput({
  value,
  onChange,
  onKeyDown,
  onSend,
  onUpload,
  onLibrary,
  onToggleSearch,
  isSearchOpen,
  isParticipant,
  isSending,
  InputComponent,
  ButtonComponent,
  TooltipWrapper,
}: ChatMessageInputProps) {
  const Wrap =
    TooltipWrapper ??
    (({ children }: { label: string; children: React.ReactNode }) => (
      <>{children}</>
    ));

  return (
    <div className="flex-shrink-0 border-t p-3">
      <div
        className={`bg-muted flex items-center gap-2 rounded-md border px-3 ${
          !isParticipant ? 'opacity-50' : ''
        }`}
      >
        <InputComponent
          aria-label="메시지 입력"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={
            isParticipant
              ? '메시지 입력...'
              : '채팅방에 참여 후 입력할 수 있습니다.'
          }
          className="h-11 flex-1 border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0"
          disabled={isSending || !isParticipant}
        />
        <div className="flex items-center gap-1">
          {onToggleSearch && (
            <Wrap label="메시지 검색">
              <ButtonComponent
                aria-label="메시지 검색"
                size="icon"
                variant="ghost"
                className={`h-8 w-8 flex-shrink-0 ${
                  isSearchOpen ? 'text-primary' : ''
                }`}
                onClick={onToggleSearch}
              >
                <Search className="size-4" />
              </ButtonComponent>
            </Wrap>
          )}
          {onUpload && (
            <Wrap label="파일 업로드">
              <ButtonComponent
                aria-label="파일 업로드"
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={onUpload}
                disabled={isSending || !isParticipant}
              >
                <Paperclip className="size-4" />
              </ButtonComponent>
            </Wrap>
          )}
          {onLibrary && (
            <Wrap label="미디어 라이브러리">
              <ButtonComponent
                aria-label="미디어 라이브러리"
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={onLibrary}
                disabled={isSending || !isParticipant}
              >
                <Images className="size-4" />
              </ButtonComponent>
            </Wrap>
          )}
          <ButtonComponent
            size="sm"
            onClick={onSend}
            disabled={!value.trim() || isSending || !isParticipant}
            className="flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="mr-1 size-3.5 animate-spin" />
            ) : (
              <Send className="mr-1 size-3.5" />
            )}
            전송
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
}
