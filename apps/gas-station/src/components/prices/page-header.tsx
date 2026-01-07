import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  lastUpdated?: string | null;
  onRefresh: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  lastUpdated,
  onRefresh,
  loading,
  title,
  description,
}) => {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col gap-8 overflow-hidden px-6 py-12 md:py-20 md:pt-18">
        <div className="px-6 py-8 lg:px-8 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                {title}
              </h1>
              <p className="text-mid-gray max-w-lg text-base">{description}</p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-sm text-muted-foreground text-center lg:text-right">
                <Clock className="w-4 h-4 inline mr-1" />
                <div>마지막 업데이트</div>
                <div className="font-medium">{lastUpdated || '로딩 중...'}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                />
                새로고침
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
