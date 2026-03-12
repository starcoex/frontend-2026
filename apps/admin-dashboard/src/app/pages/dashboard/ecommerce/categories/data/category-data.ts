import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

// 활성화 상태 필터 옵션
export const categoryStatuses = [
  {
    label: '활성',
    value: 'true',
    icon: CheckCircledIcon,
  },
  {
    label: '비활성',
    value: 'false',
    icon: CrossCircledIcon,
  },
];

// 정렬 순서 옵션 (툴바 필터용)
export const categorySortOrders = [
  { label: '0순위', value: '0' },
  { label: '1순위', value: '1' },
  { label: '2순위', value: '2' },
  { label: '3순위', value: '3' },
];
