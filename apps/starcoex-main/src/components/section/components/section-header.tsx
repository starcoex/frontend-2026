import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle } from '@/components/ui/card';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon: LucideIcon;
  iconTitle: string;
  description: React.ReactNode;
}

const SectionHeader = ({
  className,
  title,
  icon: Icon,
  iconTitle,
  description,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        'container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8',
        className
      )}
    >
      <Badge
        variant="outline"
        className="bg-card w-fit gap-1 px-3 text-sm font-normal tracking-tight shadow-sm"
      >
        <Icon className="size-4" />
        <span>{iconTitle}</span>
      </Badge>
      <CardTitle className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
        {title}
      </CardTitle>
      <CardDescription className="text-muted-foreground max-w-[600px] tracking-[-0.32px]">
        {description}
      </CardDescription>
    </div>
  );
};

export default SectionHeader;
