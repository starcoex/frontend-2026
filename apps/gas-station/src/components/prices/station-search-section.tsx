import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GasStation } from '@starcoex-frontend/graphql';
import { useFuelData } from '@starcoex-frontend/vehicles';
import { StationDetail } from '@/components/prices/components/station-detail';
import { SearchLimitBanner } from '@/components/search-limit-banner';
import { useSearchLimit } from '@/hooks/useSearchLimit';

// Opinet API 실제 시도 코드
const REGIONS = [
  { value: '00', label: '전국' },
  { value: '11', label: '제주' },
  { value: '01', label: '서울' },
  { value: '02', label: '경기' },
  { value: '03', label: '강원' },
  { value: '04', label: '충북' },
  { value: '05', label: '충남' },
  { value: '06', label: '전북' },
  { value: '07', label: '전남' },
  { value: '08', label: '경북' },
  { value: '09', label: '경남' },
  { value: '10', label: '부산' },
  { value: '14', label: '대구' },
  { value: '15', label: '인천' },
  { value: '16', label: '광주' },
  { value: '17', label: '대전' },
  { value: '18', label: '울산' },
  { value: '19', label: '세종' },
];

export const StationSearchSection: React.FC = () => {
  const { searchGasStations, fetchStationDetail } = useFuelData();
  const {
    canSearch,
    remainingSearches,
    totalLimit,
    incrementSearchCount,
    isAuthenticated,
  } = useSearchLimit();

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GasStation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 선택된 주유소 상세 보기
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null
  );
  const [showStationDetail, setShowStationDetail] = useState(false);

  // 필터 상태 (기본값: 제주 - Opinet sidoCode '11')
  const [selectedRegion, setSelectedRegion] = useState('11');

  // 검색 핸들러
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    // 검색 제한 확인
    if (!canSearch) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const searchInput = {
        name: searchTerm,
        ...(selectedRegion !== '00' && { sidoCode: selectedRegion }),
      };

      const results = await searchGasStations(searchInput);
      setSearchResults(results);

      // 검색 성공 시 횟수 증가 (비회원만)
      incrementSearchCount();
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSearch) {
      handleSearch();
    }
  };

  const handleStationSelect = async (station: GasStation) => {
    if (station.UNI_ID) {
      await fetchStationDetail(station.UNI_ID);
      setSelectedStationId(station.UNI_ID);
      setShowStationDetail(true);
    }
  };

  const handleBackToSearch = () => {
    setShowStationDetail(false);
    setSelectedStationId(null);
  };

  // 선택된 지역 라벨 찾기
  const selectedRegionLabel =
    REGIONS.find((r) => r.value === selectedRegion)?.label || '제주';

  // 검색 제한에 도달했는지
  const isLimitReached = !isAuthenticated && !canSearch;

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container overflow-hidden py-12 md:py-32">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              주유소 검색
            </h2>
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
          {!showStationDetail ? (
            <div className="p-6 md:p-12">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    주유소 검색
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    전국 주유소를 검색하여 상세 정보를 확인하세요
                  </p>
                </div>

                {/* 비회원 검색 제한 배너 */}
                {!isAuthenticated && (
                  <SearchLimitBanner
                    remainingSearches={remainingSearches}
                    totalLimit={totalLimit}
                    isLimitReached={isLimitReached}
                  />
                )}

                {/* 검색 제한 도달 시 검색 UI 비활성화 */}
                {isLimitReached ? null : (
                  <>
                    {/* 검색 입력 + 지역 필터 */}
                    <div className="flex gap-2">
                      <Select
                        value={selectedRegion}
                        onValueChange={setSelectedRegion}
                      >
                        <SelectTrigger className="w-28 shrink-0">
                          <SelectValue placeholder="지역" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="text"
                        placeholder="주유소명 입력 (예: 별표, GS)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={isSearching}
                      />

                      <Button
                        onClick={handleSearch}
                        disabled={
                          isSearching || !searchTerm.trim() || !canSearch
                        }
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">검색</span>
                      </Button>
                    </div>

                    {/* 검색 예시 */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {['별표', 'GS', 'SK', '현대오일뱅크', 'S-OIL'].map(
                        (example) => (
                          <Button
                            key={example}
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm(example)}
                            className="text-xs"
                          >
                            {example}
                          </Button>
                        )
                      )}
                    </div>

                    {/* 검색 결과 */}
                    {searchResults.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-medium text-foreground">
                          {selectedRegionLabel} 검색 결과 (
                          {searchResults.length}
                          개)
                        </h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {searchResults.map((station) => (
                            <div
                              key={station.UNI_ID}
                              className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleStationSelect(station)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-medium text-foreground">
                                    {station.OS_NM}
                                  </h5>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {station.NEW_ADR || station.VAN_ADR}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm">
                                  상세보기
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 검색 결과 없음 */}
                    {hasSearched &&
                      searchResults.length === 0 &&
                      !isSearching && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>검색 결과가 없습니다.</p>
                          <p className="text-sm mt-1">
                            다른 검색어로 시도해보세요.
                          </p>
                        </div>
                      )}

                    {/* 안내 메시지 */}
                    {!hasSearched && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>주유소명이나 브랜드명을 입력하여 검색하세요.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* 상세 정보 헤더 - 뒤로가기 버튼 */}
              <div className="flex items-center justify-end p-4 border-b border-border">
                <Button variant="outline" onClick={handleBackToSearch}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  검색으로 돌아가기
                </Button>
              </div>

              {/* StationDetail 컴포넌트 재사용 */}
              <StationDetail stationId={selectedStationId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
