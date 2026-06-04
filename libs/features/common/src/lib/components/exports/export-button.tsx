import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui';
import { exportToExcel, exportToPDF, type ExportColumn } from '../../utils';
import { useState } from 'react';

interface Props {
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  fileName: string;
  pdfTitle?: string;
}

export function ExportButton({ data, columns, fileName, pdfTitle }: Props) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfExport = async () => {
    setPdfLoading(true);
    try {
      await exportToPDF(data, columns, pdfTitle ?? fileName, fileName);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
          <Download className="h-3 w-3" />
          내보내기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => exportToExcel(data, columns, fileName)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePdfExport} disabled={pdfLoading}>
          {pdfLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4 text-red-500" />
          )}
          PDF {pdfLoading && '생성 중...'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
