import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { AddressSearchDialog } from '../components/address-search-dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADDRESS_ROUTES } from '@/app/constants/address-routes';

export default function AddressCreatePage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleSaved = () => {
    navigate(ADDRESS_ROUTES.LIST);
  };

  return (
    <>
      <PageHead
        title={`주소 검색 · 저장 - ${COMPANY_INFO.name}`}
        description="도로명주소를 검색하고 저장하세요."
        keywords={['주소 검색', '주소 저장', '도로명주소', COMPANY_INFO.name]}
        og={{
          title: `주소 검색 · 저장 - ${COMPANY_INFO.name}`,
          description: '도로명주소 검색 및 저장',
          image: '/images/og-address.jpg',
          type: 'website',
        }}
      />
      <AddressSearchDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) navigate(ADDRESS_ROUTES.LIST);
        }}
        onSaved={handleSaved}
      />
    </>
  );
}
