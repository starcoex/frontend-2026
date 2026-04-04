import { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from '@starcoex-frontend/common';
import type { Payment } from '@starcoex-frontend/payments';

interface PaymentTableToolbarProps {
  table: Table<Payment>;
}

export function PaymentTableToolbar({ table }: PaymentTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        총{' '}
        <span className="text-foreground font-medium">
          {table.getFilteredRowModel().rows.length}
        </span>
        건
      </p>
      <DataTableViewOptions table={table} />
    </div>
  );
}
