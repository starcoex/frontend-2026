import { Button, buttonVariants } from './ui';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';

export function BackButton({
  variant = 'outline',
  children = '돌아가기',
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const navigate = useNavigate();
  return (
    <Button variant={variant} onClick={() => navigate(-1)} {...props}>
      {children}
    </Button>
  );
}
