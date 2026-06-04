import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
}

/**
 * 한글 폰트를 동적으로 로드하여 jsPDF 인스턴스를 생성합니다.
 * /public/fonts/NotoSansKR-Regular.ttf 파일이 필요합니다.
 */
async function createPDFWithKoreanFont(): Promise<jsPDF> {
  const doc = new jsPDF();

  try {
    const response = await fetch('/fonts/NanumGothic-Regular.ttf');
    const buffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    doc.addFileToVFS('NotoSansKR-Regular.ttf', base64);
    doc.addFont('NotoSansKR-Regular.ttf', 'NotoSansKR', 'normal');
    doc.setFont('NotoSansKR');
  } catch {
    // 폰트 로드 실패 시 기본 폰트 사용
    console.warn('한글 폰트 로드 실패. 기본 폰트를 사용합니다.');
  }

  return doc;
}

/**
 * 데이터를 Excel(xlsx) 파일로 내보냅니다.
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  fileName: string
) {
  const rows = data.map((item) =>
    columns.reduce<Record<string, unknown>>((acc, col) => {
      acc[col.header] = item[col.key] ?? '';
      return acc;
    }, {})
  );

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const colWidths = columns.map((col) => ({
    wch: Math.max(
      col.header.length * 2,
      ...data.map((row) => String(row[col.key] ?? '').length)
    ),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '데이터');
  XLSX.writeFile(
    workbook,
    `${fileName}-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

/**
 * 데이터를 PDF 파일로 내보냅니다. (한글 지원)
 */
export async function exportToPDF(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  title: string,
  fileName: string
) {
  const doc = await createPDFWithKoreanFont();
  const fontName = doc.getFont().fontName;

  doc.setFontSize(14);
  doc.text(title, 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 14, 23);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 28,
    head: [columns.map((c) => c.header)],
    body: data.map((item) => columns.map((c) => String(item[c.key] ?? ''))),
    styles: {
      font: fontName,
      fontSize: 9,
    },
    headStyles: {
      font: fontName,
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'normal',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  doc.save(`${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
