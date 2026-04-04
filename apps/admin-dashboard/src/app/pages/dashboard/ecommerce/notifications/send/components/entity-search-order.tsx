import { useState, useEffect } from 'react';
import { useOrders } from '@starcoex-frontend/orders';
import { EntitySearchInput } from './entity-search-input';
import { SelectedEntityCard } from './selected-entity-card';
import type { EntitySearchProps, SelectedEntity } from './entity-search.types';

interface Props extends EntitySearchProps {
  selected: SelectedEntity | null;
  onClear: () => void;
}

export function EntitySearchOrder({ selected, onSelect, onClear }: Props) {
  const { orders, fetchOrders, isLoading } = useOrders();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (orders.length === 0) fetchOrders();
  }, []);

  const results = orders
    .filter((o) => {
      const q = query.toLowerCase();
      // customerName 없음 → orderNumber, id, guestEmail, storeName으로 검색
      return (
        String(o.id).includes(q) ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.storeName?.toLowerCase().includes(q) ||
        o.guestEmail?.toLowerCase().includes(q)
      );
    })
    .slice(0, 10)
    .map((o) => ({
      key: String(o.id),
      primary: `주문번호: ${o.orderNumber}`,
      // 고객 식별: userId 또는 guestEmail 표시
      secondary: [
        `ID: #${o.id}`,
        o.storeName ? `매장: ${o.storeName}` : null,
        o.guestEmail ? `이메일: ${o.guestEmail}` : null,
        o.userId ? `유저: #${o.userId}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }));

  const handleSelect = (key: string) => {
    const order = orders.find((o) => String(o.id) === key);
    if (!order) return;
    onSelect({
      id: order.id,
      displayId: `#${order.id}`,
      label: `주문번호: ${order.orderNumber}`,
      path: `/admin/orders/${order.id}`,
    });
    setQuery('');
  };

  if (selected) {
    return (
      <SelectedEntityCard
        entity={selected}
        typeLabel="주문"
        onClear={onClear}
      />
    );
  }

  return (
    <EntitySearchInput
      placeholder="주문번호, 매장명, 이메일로 검색"
      query={query}
      onQueryChange={setQuery}
      results={results}
      onSelect={handleSelect}
      isLoading={isLoading}
    />
  );
}
