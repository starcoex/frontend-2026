import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { Delivery } from '@starcoex-frontend/delivery';
import { formatDeliveryFee } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

export function DeliveryInfoCard({ d }: { d: Delivery }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>배송 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">주문 ID</TableCell>
              <TableCell className="text-right">#{d.orderId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">매장 ID</TableCell>
              <TableCell className="text-right">#{d.storeId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">요청일시</TableCell>
              <TableCell className="text-right text-sm">
                {new Date(d.requestedAt).toLocaleString('ko-KR')}
              </TableCell>
            </TableRow>
            {d.acceptedAt && (
              <TableRow>
                <TableCell className="font-semibold">수락일시</TableCell>
                <TableCell className="text-right text-sm">
                  {new Date(d.acceptedAt).toLocaleString('ko-KR')}
                </TableCell>
              </TableRow>
            )}
            {d.pickedUpAt && (
              <TableRow>
                <TableCell className="font-semibold">픽업일시</TableCell>
                <TableCell className="text-right text-sm">
                  {new Date(d.pickedUpAt).toLocaleString('ko-KR')}
                </TableCell>
              </TableRow>
            )}
            {d.deliveredAt && (
              <TableRow>
                <TableCell className="font-semibold">완료일시</TableCell>
                <TableCell className="text-right text-sm">
                  {new Date(d.deliveredAt).toLocaleString('ko-KR')}
                </TableCell>
              </TableRow>
            )}
            {d.totalWeight && (
              <TableRow>
                <TableCell className="font-semibold">총 무게</TableCell>
                <TableCell className="text-right">{d.totalWeight}kg</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-semibold">플랫폼 수수료</TableCell>
              <TableCell className="text-right">
                {formatDeliveryFee(d.platformFee)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
