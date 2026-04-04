export interface SelectedEntity {
  id: number;
  displayId: string;
  label: string;
  /** 반드시 /admin/ 접두어가 있는 실제 라우터 경로 */
  path: string;
}

export interface EntitySearchProps {
  onSelect: (entity: SelectedEntity) => void;
}
