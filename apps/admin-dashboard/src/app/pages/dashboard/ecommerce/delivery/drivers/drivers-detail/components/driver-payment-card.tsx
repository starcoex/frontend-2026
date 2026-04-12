import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { formatDeliveryFee } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

const PAYMENT_TYPE_LABEL: Record<string, string> = {
  PER_DELIVERY: '건당 수수료',
  HOURLY: '시급',
  MONTHLY: '월급',
};

export function DriverPaymentCard({ driver }: { driver: DeliveryDriver }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          정산 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">정산 방식</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">
                  {PAYMENT_TYPE_LABEL[driver.paymentType] ?? driver.paymentType}
                </Badge>
              </TableCell>
            </TableRow>
            {driver.paymentType === 'PER_DELIVERY' &&
              driver.ratePerDelivery && (
                <TableRow>
                  <TableCell className="font-semibold">건당 수수료</TableCell>
                  <TableCell className="text-right">
                    {formatDeliveryFee(driver.ratePerDelivery)}
                  </TableCell>
                </TableRow>
              )}
            {driver.paymentType === 'HOURLY' && driver.hourlyRate && (
              <TableRow>
                <TableCell className="font-semibold">시급</TableCell>
                <TableCell className="text-right">
                  {formatDeliveryFee(driver.hourlyRate)}/h
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
