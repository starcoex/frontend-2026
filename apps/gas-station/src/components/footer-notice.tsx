import React from 'react';
import { Link } from 'react-router-dom';

export const FooterNotice: React.FC = () => (
  <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
    <div className="border-dark-gray container gap-8 overflow-hidden py-12 text-center md:py-10">
      <p className="text-sm text-muted-foreground mb-2">
        <strong>데이터 출처:</strong> 한국석유공사 오피넷
        <Link to="https://www.opinet.co.kr" target="_blank">
          (opinet.co.kr)
        </Link>
      </p>
      <p className="text-xs text-muted-foreground">
        실제 주유소 가격은 지역별, 브랜드별로 차이가 있을 수 있습니다. 정확한
        가격은 해당 주유소에 직접 문의하시기 바랍니다.
      </p>
    </div>
  </section>
);
