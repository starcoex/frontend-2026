import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Delivery } from '@starcoex-frontend/delivery';

type ParsedAddress = {
  address?: string;
  zipCode?: string;
  detail?: string;
} | null;

function parseAddress(raw: unknown): ParsedAddress {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const obj = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    if (obj && typeof obj === 'object' && 'address' in obj) {
      return obj as ParsedAddress;
    }
    return null;
  } catch {
    return null;
  }
}

function AddressBlock({
  label,
  parsed,
  iconClass,
}: {
  label: string;
  parsed: ParsedAddress;
  iconClass: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <MapPin className={`size-4 ${iconClass}`} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="text-muted-foreground pl-6 text-sm">
        {parsed
          ? [parsed.address, parsed.detail].filter(Boolean).join(', ') || '-'
          : '주소 정보 없음'}
      </p>
      {parsed?.zipCode && (
        <p className="text-muted-foreground pl-6 text-xs">
          우편번호: {parsed.zipCode}
        </p>
      )}
    </div>
  );
}

export function DeliveryAddressCard({ d }: { d: Delivery }) {
  const pickupParsed = parseAddress(d.pickupAddress);
  const deliveryParsed = parseAddress(d.deliveryAddress);

  return (
    <Card>
      <CardHeader>
        <CardTitle>주소 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddressBlock
          label="픽업 주소"
          parsed={pickupParsed}
          iconClass="text-primary"
        />
        <AddressBlock
          label="배송 주소"
          parsed={deliveryParsed}
          iconClass="text-destructive"
        />
        {d.specialInstructions && (
          <div className="space-y-1">
            <span className="text-sm font-semibold">특별 지시사항</span>
            <p className="text-muted-foreground text-sm">
              {d.specialInstructions}
            </p>
          </div>
        )}
        {d.customerNotes && (
          <div className="space-y-1">
            <span className="text-sm font-semibold">고객 요청사항</span>
            <p className="text-muted-foreground text-sm">{d.customerNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
