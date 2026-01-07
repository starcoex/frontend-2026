import { cn } from '@/lib/utils';
import React from 'react';

export const BorderedSection = ({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn('relative w-[159px] border-r p-1 max-lg:hidden', className)}
  >
    {children}
  </div>
);
