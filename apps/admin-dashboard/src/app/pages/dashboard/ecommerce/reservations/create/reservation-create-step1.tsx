import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Wrench, ChevronsUpDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReservationCreateFormValues } from './reservation-create-schema';
import { useStores } from '@starcoex-frontend/stores';
import { useReservations } from '@starcoex-frontend/reservations'; // ← usePayments 대신
import { useEffect, useMemo, useState } from 'react';

interface Step1Props {
  form: UseFormReturn<ReservationCreateFormValues>;
}

export function ReservationCreateStep1({ form }: Step1Props) {
  const { stores, fetchStores } = useStores();
  const { fetchReservableServices } = useReservations(); // ← 변경

  const [serviceOpen, setServiceOpen] = useState(false);
  const [reservableServices, setReservableServices] = useState<any[]>([]); // ← ReservableService 목록

  const selectedStoreId = form.watch('storeId');
  const selectedServiceIds = form.watch('serviceIds') ?? [];

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // 매장 선택 시 해당 매장의 ReservableService 조회
  useEffect(() => {
    if (!selectedStoreId) return;
    setReservableServices([]);
    fetchReservableServices({ storeId: selectedStoreId, isActive: true }).then(
      (res) => {
        if (res.success && res.data?.services) {
          setReservableServices(res.data.services);
        }
      }
    );
  }, [selectedStoreId, fetchReservableServices]);

  const selectedServices = useMemo(
    () => reservableServices.filter((s) => selectedServiceIds.includes(s.id)),
    [reservableServices, selectedServiceIds]
  );

  const totalServiceAmount = useMemo(
    () => selectedServices.reduce((sum, s) => sum + (s.basePrice ?? 0), 0),
    [selectedServices]
  );

  const toggleService = (serviceId: number) => {
    const current = form.getValues('serviceIds') ?? [];
    const next = current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId];
    form.setValue('serviceIds', next, { shouldValidate: true });
    // serviceAmount, totalAmount는 폼 스키마에 없으므로 제거
    // totalServiceAmount useMemo로 자동 계산됨
  };

  const removeService = (serviceId: number) => {
    toggleService(serviceId);
  };

  return (
    <div className="space-y-4">
      {/* 매장 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Store className="size-4 opacity-60" />
            매장 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="storeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>매장 *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => {
                      field.onChange(Number(v));
                      form.setValue('serviceIds', []);
                      // serviceAmount, totalAmount 제거
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="매장을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={String(store.id)}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 서비스 다중 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="size-4 opacity-60" />
            서비스 선택
            {selectedServices.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {selectedServices.length}개 선택
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormField
            control={form.control}
            name="serviceIds"
            render={() => (
              <FormItem>
                <FormLabel>
                  서비스 *{' '}
                  <span className="text-muted-foreground font-normal text-xs">
                    (복수 선택 가능)
                  </span>
                </FormLabel>
                <FormControl>
                  <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!selectedStoreId}
                        className="w-full justify-between font-normal"
                      >
                        <span className="text-muted-foreground">
                          {selectedStoreId
                            ? '서비스를 검색하여 추가하세요'
                            : '매장을 먼저 선택하세요'}
                        </span>
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="서비스 검색..." />
                        <CommandList>
                          <CommandEmpty>
                            {reservableServices.length === 0
                              ? '해당 매장에 등록된 서비스가 없습니다.'
                              : '검색 결과가 없습니다.'}
                          </CommandEmpty>
                          <CommandGroup>
                            {reservableServices.map((service) => {
                              const isSelected = selectedServiceIds.includes(
                                service.id
                              );
                              return (
                                <CommandItem
                                  key={service.id}
                                  value={service.name}
                                  onSelect={() => toggleService(service.id)}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 size-4 shrink-0',
                                      isSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  <div className="flex flex-1 items-center justify-between">
                                    <span>{service.name}</span>
                                    {service.basePrice > 0 && (
                                      <span className="text-muted-foreground text-xs">
                                        ₩{service.basePrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 선택된 서비스 목록 */}
          {selectedServices.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <Badge
                    key={service.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 text-sm"
                  >
                    <span>{service.name}</span>
                    {service.basePrice > 0 && (
                      <span className="text-muted-foreground text-xs">
                        ₩{service.basePrice.toLocaleString()}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="hover:bg-muted ml-1 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* 합계 */}
              <div className="bg-muted flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span className="text-muted-foreground">서비스 합계</span>
                <span className="font-semibold">
                  ₩{totalServiceAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
