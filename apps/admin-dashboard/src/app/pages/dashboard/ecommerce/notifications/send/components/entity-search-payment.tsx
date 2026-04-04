import { useState, useEffect } from 'react';
import { usePayments } from '@starcoex-frontend/payments';
import { EntitySearchInput } from './entity-search-input';
import { SelectedEntityCard } from './selected-entity-card';
import type { EntitySearchProps, SelectedEntity } from './entity-search.types';

interface Props extends EntitySearchProps {
  selected: SelectedEntity | null;
  onClear: () => void;
}

export function EntitySearchPayment({ selected, onSelect, onClear }: Props) {
  const { payments, fetchPayments, isLoading } = usePayments();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (payments.length === 0) fetchPayments();
  }, []);

  const results = payments
    .filter((p) => {
      const q = query.toLowerCase();
      return (
        String(p.id).includes(q) ||
        p.portOneId?.toLowerCase().includes(q) ||
        String(p.amount ?? '').includes(q)
      );
    })
    .slice(0, 10)
    .map((p) => ({
      key: String(p.id),
      primary: `결제 #${p.id} · ₩${(p.amount ?? 0).toLocaleString()}`,
      secondary: p.portOneId ? `portOneId: ${p.portOneId}` : `ID: #${p.id}`,
    }));

  const handleSelect = (key: string) => {
    const payment = payments.find((p) => String(p.id) === key);
    if (!payment) return;
    onSelect({
      id: payment.id,
      displayId: payment.portOneId ?? `#${payment.id}`,
      label: `결제 #${payment.id} · ₩${(payment.amount ?? 0).toLocaleString()}`,
      // 결제 상세는 portOneId 경로
      path: `/admin/payments/${payment.portOneId ?? payment.id}`,
    });
    setQuery('');
  };

  if (selected) {
    return (
      <SelectedEntityCard
        entity={selected}
        typeLabel="결제"
        onClear={onClear}
      />
    );
  }

  return (
    <EntitySearchInput
      placeholder="결제 ID 또는 portOneId로 검색"
      query={query}
      onQueryChange={setQuery}
      results={results}
      onSelect={handleSelect}
      isLoading={isLoading}
    />
  );
}
