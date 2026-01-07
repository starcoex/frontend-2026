import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import { SearchProvider } from '@/components/search-provider';
import { TeamProvider } from '@/components/team-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // 전역 키보드 단축키 등록
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) 또는 Ctrl+K (Windows/Linux)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }

      // ESC로 검색 닫기
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="admin-dashboard-theme">
      <TeamProvider>
        <SearchProvider value={{ open: searchOpen, setOpen: setSearchOpen }}>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
            theme="system" // 테마에 따라 자동 변경
          />
        </SearchProvider>
      </TeamProvider>
    </ThemeProvider>
  );
};
