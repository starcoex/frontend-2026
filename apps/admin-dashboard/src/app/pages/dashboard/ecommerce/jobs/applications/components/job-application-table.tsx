import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DataTablePagination } from '@starcoex-frontend/common';
import { ApplicationToolbar } from './job-application-toolbar';
import { applicationColumns } from './job-application-columns';
import { ApplicantProfileDetail } from './applicant-profile-detail';
import type { JobApplication, JobPosting } from '@starcoex-frontend/jobs';

interface ApplicationTableProps {
  data: JobApplication[];
  jobPostings: JobPosting[];
  initialPostingId?: string;
  onRefresh?: () => void;
}

export function ApplicationTable({
  data,
  jobPostings,
  initialPostingId,
  onRefresh,
}: ApplicationTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    // URL에서 postingId가 있으면 초기 필터로 설정
    () =>
      initialPostingId ? [{ id: 'postingId', value: [initialPostingId] }] : []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ postingId: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  // 공고별 필터 옵션 동적 생성
  const postingOptions = React.useMemo(
    () =>
      jobPostings.map((job) => ({
        value: String(job.id),
        label: `${job.title} (${job.applicationCount}명)`,
      })),
    [jobPostings]
  );

  const table = useReactTable({
    data,
    columns: applicationColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    state: { sorting, columnFilters, columnVisibility, rowSelection, expanded },
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="space-y-4">
      <ApplicationToolbar
        table={table}
        postingOptions={postingOptions}
        onRefresh={onRefresh}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {/* 펼치기 컬럼 헤더 */}
                <TableHead className="w-8" />
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Collapsible key={row.id} asChild>
                  <>
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                      {/* 펼치기 버튼 */}
                      <TableCell className="w-8 pr-0">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* 펼쳐지는 프로필 상세 */}
                    <CollapsibleContent asChild>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell
                          colSpan={applicationColumns.length + 1}
                          className="px-6 py-4"
                        >
                          {row.original.profile ? (
                            <ApplicantProfileDetail
                              profile={row.original.profile}
                              statusHistories={row.original.statusHistories}
                              statusNote={row.original.statusNote}
                            />
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              프로필 정보 없음
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={applicationColumns.length + 1}
                  className="text-muted-foreground h-24 text-center"
                >
                  {table.getState().columnFilters.length > 0
                    ? '검색 결과가 없습니다. 필터를 초기화해보세요.'
                    : '지원자가 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
