import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Settings, MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  description,
  href,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(href)}
      className="flex items-center justify-between p-4 hover:bg-muted rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-full">{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export const MyInfoTab: React.FC = () => {
  const menuItems: MenuItemProps[] = [
    {
      icon: <User className="h-5 w-5" />,
      title: '프로필 관리',
      description: '이름, 연락처, 프로필 사진 변경',
      href: '/profile',
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: '보안 설정',
      description: '비밀번호 변경, 2단계 인증',
      href: '/security',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: '계정 설정',
      description: '알림 설정, 계정 삭제',
      href: '/settings',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: '배송지 관리',
      description: '등유 배송 주소 관리',
      href: '/addresses',
    },
  ];

  return (
    <Card>
      <CardContent className="p-2">
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </CardContent>
    </Card>
  );
};
