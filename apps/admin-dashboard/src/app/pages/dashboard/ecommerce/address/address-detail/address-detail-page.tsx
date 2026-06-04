import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHead, LoadingSpinner } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, MapPin, Building2, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAddress } from '@starcoex-frontend/address';
import {
  ADDRESS_STATUS_CONFIG,
  ADDRESS_DATA_SOURCE_CONFIG,
  ADDRESS_BUILDING_TYPE_CONFIG,
} from '../data/address-data';
import type { Address } from '@starcoex-frontend/address';


export default function AddressDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isLoading, error, getUserAddressById, removeAddress } = useAddress();
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (id) {
      getUserAddressById(Number(id)).then((res) => {
        if (res.success && res.data) setAddress(res.data);
      });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!address) return;
    const res = await removeAddress(address.id);
    if (res.success) navigate('/admin/addresses');
  };

  if (isLoading) return <LoadingSpinner message="주소 정보를 불러오는 중..." />;

  if (error || !address) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '주소 정보를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/addresses')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // address 가 Address 타입으로 좁혀졌으므로 타입 에러 없음
  const statusConfig = ADDRESS_STATUS_CONFIG[address.status];
  const sourceConfig = ADDRESS_DATA_SOURCE_CONFIG[address.dataSource];
  const buildingConfig = ADDRESS_BUILDING_TYPE_CONFIG[address.buildingType];

  return (
    <>
      <PageHead
        title={`주소 #${address.id} - ${COMPANY_INFO.name}`}
        description="주소 상세 정보"
        keywords={['주소 상세', COMPANY_INFO.name]}
        og={{
          title: `주소 #${address.id} - ${COMPANY_INFO.name}`,
          description: '주소 상세 정보',
          image: '/images/og-address.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/addresses">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
                  {address.roadFullAddr}
                </h1>
                {statusConfig && (
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {address.jibunAddr}
              </p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            삭제
          </Button>
        </div>

        {/* 요약 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Hash, label: '우편번호', value: address.zipNo },
            {
              icon: MapPin,
              label: '지역',
              value: [address.siNm, address.sggNm, address.emdNm]
                .filter(Boolean)
                .join(' '),
            },
            {
              icon: Building2,
              label: '건물 유형',
              value: buildingConfig?.label ?? address.buildingType,
            },
            {
              icon: MapPin,
              label: '출처',
              value: sourceConfig?.label ?? address.dataSource,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4"
            >
              <item.icon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">
                  {item.label}
                </span>
                <span className="text-lg font-semibold">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 상세 정보 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 opacity-60" />
                주소 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {[
                    { label: '전체 도로명', value: address.roadFullAddr },
                    { label: '도로명 (본)', value: address.roadAddrPart1 },
                    {
                      label: '도로명 (참고)',
                      value: address.roadAddrPart2 ?? '-',
                    },
                    { label: '지번주소', value: address.jibunAddr },
                    { label: '영문주소', value: address.engAddr },
                    { label: '상세주소', value: address.addrDetail ?? '-' },
                    { label: '우편번호', value: address.zipNo },
                  ].map(({ label, value }) => (
                    <TableRow key={label}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell className="text-right text-sm">
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 opacity-60" />
                행정 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {[
                    { label: '시도', value: address.siNm },
                    { label: '시군구', value: address.sggNm ?? '-' },
                    { label: '읍면동', value: address.emdNm },
                    { label: '도로명', value: address.rn },
                    { label: '건물명', value: address.bdNm ?? '-' },
                    { label: '사용 횟수', value: `${address.usageCount}회` },
                    {
                      label: '등록일',
                      value: format(
                        new Date(address.createdAt),
                        'yyyy.MM.dd HH:mm',
                        { locale: ko }
                      ),
                    },
                  ].map(({ label, value }) => (
                    <TableRow key={label}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell className="text-right text-sm">
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
