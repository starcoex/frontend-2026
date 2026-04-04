import React from 'react';

export interface StarcoexService {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>; // string에서 React 컴포넌트로 변경
  category: 'fuel' | 'wash' | 'delivery' | 'main';
  status: 'active' | 'coming-soon' | 'maintenance';
  external?: boolean;
}

export interface StarcoexServicesMobileSectionProps {
  services: StarcoexService[];
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClose: () => void;
  onServiceClick?: (service: StarcoexService) => void;
}

export interface StarcoexServicesDropdownProps {
  services: StarcoexService[];
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  contentClassName?: string;
  onServiceClick?: (service: StarcoexService) => void;
}
