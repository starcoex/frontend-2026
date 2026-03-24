import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ReservationEditFormValues } from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-schema';
import {
  CustomerSearch,
  SelectedCustomer,
} from '@/app/pages/dashboard/ecommerce/orders/components/customer-search';
import { useState } from 'react';

interface Props {
  form: UseFormReturn<ReservationEditFormValues>;
}

export function ReservationEditSectionCustomer({ form }: Props) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  const handleSelectCustomer = (customer: SelectedCustomer) => {
    setSelectedCustomer(customer);
    form.setValue('customerName', customer.name, { shouldValidate: true });
    form.setValue('customerPhone', customer.phone, { shouldValidate: true });
    form.setValue('guestEmail', customer.email ?? '');
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    form.setValue('customerName', '');
    form.setValue('customerPhone', '');
    form.setValue('guestEmail', '');
  };

  return (
    <div className="space-y-4">
      {/* 고객 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4 opacity-60" />
            고객 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomerSearch
            selected={selectedCustomer}
            onSelect={handleSelectCustomer}
            onClear={handleClearCustomer}
            enableCreate={true}
          />
        </CardContent>
      </Card>

      {/* 추가 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">추가 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="partySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인원 *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량 ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="차량 ID (선택)"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>특이사항</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="특별 요청 사항" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
