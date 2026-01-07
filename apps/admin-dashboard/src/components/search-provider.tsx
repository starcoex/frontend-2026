import React, { createContext, useContext } from 'react';

interface SearchContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: React.ReactNode;
  value: SearchContextType;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
  children,
  value,
}) => {
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch는 SearchProvider 내부에서 사용되어야 합니다');
  }
  return context;
};
