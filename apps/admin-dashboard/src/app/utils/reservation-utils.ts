import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * ISO 문자열 또는 Date → 안전한 Date 변환
 */
const toDate = (value: string | Date): Date | null => {
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

/**
 * 예약일 표시
 * "2026-03-29T03:00:00.000Z" → "2026.03.29 (일)"
 */
export const formatReservationDate = (value: string | Date): string => {
  const date = toDate(value);
  if (!date) return '-';
  return format(date, 'yyyy.MM.dd (EEE)', { locale: ko });
};

/**
 * 시간만 표시
 * "2026-03-29T03:00:00.000Z" → "12:00"
 */
export const formatReservationTime = (value: string | Date): string => {
  const date = toDate(value);
  if (!date) return '-';
  return format(date, 'HH:mm');
};

/**
 * 예약일 + 시간 범위 표시 (목록/상세용)
 * → "2026.03.29 (일) 12:00 ~ 13:00"
 */
export const formatReservationPeriod = (
  start: string | Date,
  end: string | Date
): string => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return '-';
  return `${format(startDate, 'yyyy.MM.dd (EEE)', { locale: ko })} ${format(
    startDate,
    'HH:mm'
  )} ~ ${format(endDate, 'HH:mm')}`;
};

/**
 * 날짜+시간 풀 표시
 * → "2026.03.29 (일) 12:00"
 */
export const formatReservationDateTime = (value: string | Date): string => {
  const date = toDate(value);
  if (!date) return '-';
  return format(date, 'yyyy.MM.dd (EEE) HH:mm', { locale: ko });
};
