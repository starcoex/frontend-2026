import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Delivery } from '@starcoex-frontend/delivery';
import { DELIVERY_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

export function DeliveryHistoryTab({ d }: { d: Delivery }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상태 변경 이력</CardTitle>
      </CardHeader>
      <CardContent>
        {d.statusHistory.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">
              상태 변경 이력이 없습니다.
            </p>
          </div>
        ) : (
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {d.statusHistory.map((history) => (
              <li key={history.id} className="mb-6 ml-4">
                <div className="bg-primary absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white dark:border-gray-900" />
                <div className="flex items-center gap-2">
                  {history.fromStatus && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        {DELIVERY_STATUS_CONFIG[history.fromStatus].label}
                      </Badge>
                      <span className="text-muted-foreground text-xs">→</span>
                    </>
                  )}
                  <Badge
                    variant={DELIVERY_STATUS_CONFIG[history.toStatus].variant}
                    className="text-xs"
                  >
                    {DELIVERY_STATUS_CONFIG[history.toStatus].label}
                  </Badge>
                </div>
                <time className="text-muted-foreground mt-1 block text-xs">
                  {new Date(history.createdAt).toLocaleString('ko-KR')}
                </time>
                {history.reason && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {history.reason}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
