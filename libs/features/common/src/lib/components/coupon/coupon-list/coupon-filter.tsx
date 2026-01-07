import React from 'react';
import { CouponStatus } from '@starcoex-frontend/graphql';
import { Tabs, TabsList, TabsTrigger, Badge } from '../../ui';

interface CouponFilterProps {
  currentStatus: CouponStatus | 'ALL';
  onStatusChange: (status: CouponStatus | 'ALL') => void;
  counts?: {
    all: number;
    active: number;
    used: number;
    expired: number;
  };
}

export const CouponFilter: React.FC<CouponFilterProps> = ({
  currentStatus,
  onStatusChange,
  counts,
}) => {
  const filters: {
    value: CouponStatus | 'ALL';
    label: string;
    count?: number;
  }[] = [
    { value: 'ALL', label: '전체', count: counts?.all },
    { value: 'ACTIVE', label: '사용 가능', count: counts?.active },
    { value: 'USED', label: '사용 완료', count: counts?.used },
    { value: 'EXPIRED', label: '만료', count: counts?.expired },
  ];

  return (
    <Tabs
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value as CouponStatus | 'ALL')}
      className="w-full"
    >
      <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
        {filters.map((filter) => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            {filter.label}
            {filter.count !== undefined && (
              <Badge
                variant={
                  currentStatus === filter.value ? 'default' : 'secondary'
                }
                className="h-5 min-w-[20px] px-1.5 text-xs"
              >
                {filter.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
