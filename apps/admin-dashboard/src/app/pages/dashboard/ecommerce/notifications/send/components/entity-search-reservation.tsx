import { useState, useEffect } from 'react';
import { useReservations } from '@starcoex-frontend/reservations';
import { EntitySearchInput } from './entity-search-input';
import { SelectedEntityCard } from './selected-entity-card';
import type { EntitySearchProps, SelectedEntity } from './entity-search.types';

interface Props extends EntitySearchProps {
  selected: SelectedEntity | null;
  onClear: () => void;
}

export function EntitySearchReservation({
  selected,
  onSelect,
  onClear,
}: Props) {
  const { reservations, fetchReservations, isLoading } = useReservations();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (reservations.length === 0) fetchReservations({});
  }, []);

  const results = reservations
    .filter((r) => {
      const q = query.toLowerCase();
      // customerName 없음
      // customerInfo(JSON) 안의 name을 꺼내 검색
      const customerName = (r.customerInfo as Record<string, unknown>)?.name;
      return (
        String(r.id).includes(q) ||
        r.reservationNumber?.toLowerCase().includes(q) ||
        r.guestEmail?.toLowerCase().includes(q) ||
        (typeof customerName === 'string' &&
          customerName.toLowerCase().includes(q))
      );
    })
    .slice(0, 10)
    .map((r) => {
      const customerName = (r.customerInfo as Record<string, unknown>)?.name;
      return {
        key: String(r.id),
        primary: `예약번호: ${r.reservationNumber}`,
        secondary: [
          `ID: #${r.id}`,
          typeof customerName === 'string' ? `고객: ${customerName}` : null,
          r.guestEmail ? `이메일: ${r.guestEmail}` : null,
          r.userId ? `유저: #${r.userId}` : null,
          r.status ? `상태: ${r.status}` : null,
        ]
          .filter(Boolean)
          .join(' · '),
      };
    });

  const handleSelect = (key: string) => {
    const reservation = reservations.find((r) => String(r.id) === key);
    if (!reservation) return;

    const customerName = (reservation.customerInfo as Record<string, unknown>)
      ?.name;

    onSelect({
      id: reservation.id,
      displayId: `#${reservation.id}`,
      label: [
        `예약번호: ${reservation.reservationNumber}`,
        typeof customerName === 'string' ? `(${customerName})` : null,
      ]
        .filter(Boolean)
        .join(' '),
      path: `/admin/reservations/${reservation.id}`,
    });
    setQuery('');
  };

  if (selected) {
    return (
      <SelectedEntityCard
        entity={selected}
        typeLabel="예약"
        onClear={onClear}
      />
    );
  }

  return (
    <EntitySearchInput
      placeholder="예약번호, 고객명, 이메일로 검색"
      query={query}
      onQueryChange={setQuery}
      results={results}
      onSelect={handleSelect}
      isLoading={isLoading}
    />
  );
}
