import React from 'react';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { StarLogo, StarOilLogo, ZeragaeLogo } from '@starcoex-frontend/common';

// ── 데이터 ──────────────────────────────────────────────────────────────────────

const BRANDS = [
  {
    id: 'staroil',
    name: '별표주유소',
    nameEn: 'STAR OIL',
    meaning:
      '즐겁게 일하고 고객에게 친절한 활기차고 능동적인 서비스를 하는 기업이미지',
    symbol:
      '별모양과 점프하는 사람의 모양을 합성하여 만든 심볼은 밝고 활기찬 옐로우와 오렌지, 마젠타 색상으로 구역을 나눠 다양한 서비스를 표현하고 역동적이고 희망찬 비전을 제시',
    word: null,
    expression:
      '별모양을 분리하여 활기찬 사람의 형상을 이미지화하여 친절한 서비스를 제공하는 업체의 모습을 보여줍니다.',
    colors: [
      {
        name: 'STAR Magenta',
        hex: '#D60051',
        rgb: 'R214  G0  B81',
        cmyk: 'C10  M100  Y50  K0',
      },
      {
        name: 'STAR Orange',
        hex: '#F39800',
        rgb: 'R243  G152  B0',
        cmyk: 'C0  M50  Y100  K0',
      },
      {
        name: 'STAR Yellow',
        hex: '#FCDE00',
        rgb: 'R252  G222  B0',
        cmyk: 'C0  M11  Y100  K0',
      },
    ],
    LogoComponent: StarOilLogo,
  },
  {
    id: 'zeragae',
    name: '제라게',
    nameEn: 'ZERAGAE',
    meaning: 'Z의 앞부분과 R부분에 광택을 표시하여 세차브랜드의 의미를 부여',
    symbol: 'Zeragae의 약자 ZR',
    word: '자동차 상부라인을 합성한 레터링은 날렵하고 추진력있는 자동차세차업의 선진브랜드라는 자부심과 긍지를 보여줌',
    expression:
      "제라(최고, 아주, 매우)와 제주도 사투리 게('말할 것도 없이 당연하다'라는 뜻)의 합성어입니다.",
    colors: [
      {
        name: 'ZERAGAE Red',
        hex: '#ED1C24',
        rgb: 'R237  G28  B36',
        cmyk: 'C0  M100  Y100  K0',
      },
      {
        name: 'ZERAGAE Black',
        hex: '#323234',
        rgb: 'R50  G47  B49',
        cmyk: 'C0  M30  Y0  K95',
      },
    ],
    colorNote:
      '열정적인 제라게 레드와 블랙을 사용하여 품위있고 고급적인 브랜드의 지향점을 제시',
    LogoComponent: ZeragaeLogo,
  },
  {
    id: 'starcoex',
    name: '스타코엑스',
    nameEn: 'STARCOEX',
    meaning: null,
    meaningItems: [
      { mark: 'Star', desc: 'Starcoex의 전신인 별표 석유의 이념승계' },
      {
        mark: 'Coex',
        desc: '종합 유통, 서비스, 모빌리티등 모든것을 담고 싶다',
      },
    ],
    symbol: null,
    symbolItems: [
      {
        mark: 'S와 C',
        desc: 'S와 C를 형상화하여 담을 수 있고 정도를 의미할 수 있는 원형으로 표현',
      },
      {
        mark: "Star's S",
        desc: 'Star의 S에서 coex의 C로의 선과 색상의 변화 통해 역동적이고 활기찬 젊은 기업 이미지를 상징',
      },
    ],
    wordItems: [
      {
        mark: 'c',
        desc: '중심으로 심볼을 표현하여 star를 이어가고 새로운 시작의 의미',
      },
      { mark: 'oe', desc: '무한한 가능을 표현하기 위해 "∞" 기호로 형상' },
      {
        mark: 'x',
        desc: 'oe와 연결되어 사방으로 뻗어 나가자는 미래지향적 의미',
      },
    ],
    expression: '역동(에너지), 성장(미래지향), 열정(누구나)',
    colors: [
      {
        name: 'STAR COEX Red',
        hex: '#E2251C',
        rgb: 'R226  G37  B7',
        cmyk: 'C0  M90  Y80  K0',
      },
      {
        name: 'STAR Orange',
        hex: '#FAC800',
        rgb: 'R250  G190  B0',
        cmyk: 'C0  M30  Y100',
      },
    ],
    colorNotes: [
      '적색과 주황색을 교차하여 넘치는 에너지와 열정을 표현',
      '원형과 색상이 어우러져 "태양"의 모습처럼 고객을 최우선으로 빛을 내기 위함',
    ],
    LogoComponent: StarLogo,
  },
] as const;

// ── 색상 칩 ──────────────────────────────────────────────────────────────────────

const ColorChip: React.FC<{
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
}> = ({ name, hex, rgb, cmyk }) => (
  <div className="rounded-xl overflow-hidden border">
    <div className="h-16 w-full" style={{ backgroundColor: hex }} />
    <div className="p-3 space-y-0.5">
      <p className="text-xs font-semibold">{name}</p>
      <p className="text-[10px] text-muted-foreground">{rgb}</p>
      <p className="text-[10px] text-muted-foreground">{cmyk}</p>
    </div>
  </div>
);

// ── 항목 뱃지 리스트 ──────────────────────────────────────────────────────────────

const MarkList: React.FC<{
  items: readonly { mark: string; desc: string }[];
}> = ({ items }) => (
  <div className="divide-y rounded-xl border bg-card overflow-hidden">
    {items.map((item) => (
      <div key={item.mark} className="flex items-start gap-4 px-4 py-3">
        <span className="font-bold text-primary text-sm w-14 shrink-0 pt-0.5">
          {item.mark}
        </span>
        <span className="text-sm text-muted-foreground leading-relaxed">
          {item.desc}
        </span>
      </div>
    ))}
  </div>
);

// ── CiPage ────────────────────────────────────────────────────────────────────────

export const CiPage: React.FC = () => {
  return (
    <AboutLayout title="CI 소개" subtitle="스타코엑스의 브랜드 아이덴티티">
      <div className="space-y-24">
        {BRANDS.map((brand, index) => {
          const LogoComp = brand.LogoComponent;
          const isEven = index % 2 === 0;

          // 로고 + 의미 블록
          const LogoBlock = (
            <figure className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-10 h-full">
              <LogoComp width={120} height={120} className="object-contain" />
              <div className="text-center">
                <p className="text-lg font-bold">{brand.name}</p>
                <p className="text-xs text-muted-foreground">{brand.nameEn}</p>
              </div>
            </figure>
          );

          // 설명 블록
          const InfoBlock = (
            <div className="flex flex-col justify-center space-y-5">
              <h2 className="text-2xl font-bold tracking-tight">
                {brand.name}
              </h2>

              {/* 의미 */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  의미
                </h3>
                {'meaningItems' in brand && brand.meaningItems ? (
                  <MarkList items={brand.meaningItems} />
                ) : brand.meaning ? (
                  <div className="rounded-xl border bg-card px-4 py-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {brand.meaning}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* 심볼 */}
              {'symbolItems' in brand && brand.symbolItems ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    심볼(마크)
                  </h3>
                  <MarkList items={brand.symbolItems} />
                </div>
              ) : brand.symbol ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    심볼(마크)
                  </h3>
                  <div className="rounded-xl border bg-card px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {brand.symbol}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* 워드 */}
              {'wordItems' in brand && brand.wordItems ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    워드(마크)
                  </h3>
                  <MarkList items={brand.wordItems} />
                </div>
              ) : 'word' in brand && brand.word ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    워드(마크)
                  </h3>
                  <div className="rounded-xl border bg-card px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {brand.word}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* 전용색상 */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  전용색상
                </h3>
                <div
                  className={`grid gap-3 ${
                    brand.colors.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'
                  }`}
                >
                  {brand.colors.map((color) => (
                    <ColorChip key={color.name} {...color} />
                  ))}
                </div>
                {'colorNote' in brand && brand.colorNote && (
                  <p className="text-xs text-muted-foreground pt-1">
                    {brand.colorNote}
                  </p>
                )}
                {'colorNotes' in brand && brand.colorNotes && (
                  <ul className="space-y-1">
                    {brand.colorNotes.map((note, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        • {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 표현내용 */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  표현내용
                </h3>
                <div className="rounded-xl border bg-card px-4 py-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {brand.expression}
                  </p>
                </div>
              </div>
            </div>
          );

          return (
            <section key={brand.id} className="space-y-8">
              {/* 좌우 교차 배치 */}
              <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
                {isEven ? (
                  <>
                    <div className="lg:col-span-2">{LogoBlock}</div>
                    <div className="lg:col-span-3">{InfoBlock}</div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-3">{InfoBlock}</div>
                    <div className="lg:col-span-2">{LogoBlock}</div>
                  </>
                )}
              </div>

              {/* 브랜드 구분선 (마지막 제외) */}
              {index < BRANDS.length - 1 && (
                <div className="border-t border-dashed" />
              )}
            </section>
          );
        })}
      </div>
    </AboutLayout>
  );
};
