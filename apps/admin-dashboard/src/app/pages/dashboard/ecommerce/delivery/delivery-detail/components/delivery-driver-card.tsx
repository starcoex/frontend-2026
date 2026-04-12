import { Link } from 'react-router-dom';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { Delivery } from '@starcoex-frontend/delivery';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import {
  DRIVER_STATUS_CONFIG,
  VEHICLE_TYPE_CONFIG,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

export function DeliveryDriverCard({ d }: { d: Delivery }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>배달기사 정보</CardTitle>
        {d.driver && (
          <CardAction>
            <Button variant="outline" size="sm" asChild>
              <Link to={`${DELIVERY_ROUTES.DRIVERS}/${d.driver.id}`}>
                기사 상세 →
              </Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {d.driver ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">이름</TableCell>
                <TableCell className="text-right">{d.driver.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">전화번호</TableCell>
                <TableCell className="text-right">{d.driver.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">차량 타입</TableCell>
                <TableCell className="text-right">
                  {VEHICLE_TYPE_CONFIG[d.driver.vehicleType].label}
                </TableCell>
              </TableRow>
              {d.driver.vehicleNumber && (
                <TableRow>
                  <TableCell className="font-semibold">차량번호</TableCell>
                  <TableCell className="text-right">
                    {d.driver.vehicleNumber}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="font-semibold">가용 상태</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={d.driver.isAvailable ? 'success' : 'secondary'}
                  >
                    {d.driver.isAvailable ? '가용' : '비가용'}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">기사 상태</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={DRIVER_STATUS_CONFIG[d.driver.status].variant}
                  >
                    {DRIVER_STATUS_CONFIG[d.driver.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">총 배송 건수</TableCell>
                <TableCell className="text-right">
                  {d.driver.totalDeliveries}건
                </TableCell>
              </TableRow>
              {d.driver.avgRating && (
                <TableRow>
                  <TableCell className="font-semibold">평균 평점</TableCell>
                  <TableCell className="text-right">
                    ⭐ {Number(d.driver.avgRating).toFixed(1)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">
              배달기사가 아직 배정되지 않았습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
