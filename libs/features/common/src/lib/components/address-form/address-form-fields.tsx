import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import { JusoApiAddress } from '@starcoex-frontend/graphql';
import { AddressSearchInput } from './address-serach-input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '../ui';

// ✅ 다른 스키마와 병합 가능한 shape
export const addressFormSchema = z.object({
  roadAddress: z.string().min(5, { message: '도로명 주소를 입력해주세요.' }),
  jibunAddress: z.string().optional(),
  zipCode: z.string().min(5, { message: '우편번호를 입력해주세요.' }),
  addressDetail: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

interface AddressFormFieldsProps {
  form: UseFormReturn<any>;
  selectedAddress: JusoApiAddress | null;
  onAddressSelect: (address: JusoApiAddress) => void;
}

export function AddressFormFields({
  form,
  selectedAddress,
  onAddressSelect,
}: AddressFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>주소 검색 *</FormLabel>
        <AddressSearchInput
          onSelectAddress={onAddressSelect}
          className="mt-2"
        />
        <FormDescription className="mt-2">
          도로명 주소 또는 건물명으로 검색하세요.
        </FormDescription>
      </div>

      {selectedAddress && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-green-900">
                {selectedAddress.roadAddr}
              </p>
              <p className="mt-1 text-xs text-green-700">
                지번: {selectedAddress.jibunAddr}
              </p>
              <p className="text-xs text-green-700">
                우편번호: {selectedAddress.zipNo}
              </p>
            </div>
          </div>
        </div>
      )}

      <FormField
        control={form.control}
        name="roadAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>도로명 주소 *</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-muted" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>우편번호 *</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-muted" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="addressDetail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>상세주소</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="예: 3층 301호"
                disabled={!selectedAddress}
              />
            </FormControl>
            <FormDescription>
              건물명, 층, 호수 등 상세 정보를 입력하세요.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
