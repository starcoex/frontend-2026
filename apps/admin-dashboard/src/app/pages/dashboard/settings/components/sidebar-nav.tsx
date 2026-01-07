import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '@/app/types/sidebar-type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/scroll-area';

interface Props extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
}

export default function SidebarNav({ className, items, ...props }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [val, setVal] = useState(pathname ?? '/admin/settings');

  const handleSelect = (e: string) => {
    setVal(e);
    navigate(e);
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-10 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.url} value={item?.url as string}>
                <div className="flex gap-x-4 px-2 py-0.5">
                  {item.icon && (
                    <item.icon className="h-[1.125rem] w-[1.125rem]" />
                  )}
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        orientation="horizontal"
        type="always"
        className="bg-background hidden w-full min-w-48 px-1 py-2 md:block"
      >
        <nav
          className={cn(
            'flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0',
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.url}
              to={item?.url as string}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname === item.url
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start'
              )}
            >
              {item.icon && (
                <item.icon className="mr-2 h-[1.125rem] w-[1.125rem]" />
              )}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
