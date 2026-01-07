import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

// =============================================================================
// 날짜 포맷팅
// =============================================================================

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export function formatDate(
  date: Date | string,
  formatString = 'yyyy년 MM월 dd일'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return '유효하지 않은 날짜';
  }

  return format(dateObj, formatString, { locale: ko });
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷팅 (예: 2024년 1월 15일)
 */
export function formatFullDate(dateString: string): string {
  try {
    if (!dateString?.trim()) return '';

    const date = new Date(dateString.trim());
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  } catch {
    return '';
  }
}

/**
 * 상대적 시간 포맷팅 (예: "2시간 전")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return '유효하지 않은 날짜';
  }

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: ko,
  });
}

// =============================================================================
// 날짜 생성
// =============================================================================

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 특정 일수만큼 이전 날짜를 계산
 */
export function getDaysAgoDate(daysAgo = 0): string {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - daysAgo);
  return targetDate.toISOString().split('T')[0];
}

/**
 * 1개월 전 날짜를 반환
 */
export function getOneMonthAgoDate(): string {
  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  return oneMonthAgo.toISOString().split('T')[0];
}

/**
 * 1주일 간격으로 한달간의 날짜 배열 생성
 */
export function getWeeklyDatesForMonth(
  endDate: string = getTodayDate()
): string[] {
  const dates: string[] = [];
  const end = new Date(endDate);

  for (let i = 0; i < 4; i++) {
    const date = new Date(end);
    date.setDate(end.getDate() - i * 7);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates.reverse();
}

// =============================================================================
// 날짜 유효성 검사
// =============================================================================

/**
 * 날짜 범위가 유효한지 확인
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return isValid(startDate) && isValid(endDate) && startDate <= endDate;
}

/**
 * 영업시간 체크
 */
export function isBusinessHours(
  currentTime: Date = new Date(),
  startHour = 9,
  endHour = 18
): boolean {
  const hour = currentTime.getHours();
  return hour >= startHour && hour < endHour;
}
