import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video' | 'music';
  siteName?: string;
}

interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface PageHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  siteName?: string;
  url?: string;
  image?: string;
  og?: OpenGraphProps;
  twitter?: TwitterCardProps;
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: Array<{
    locale: string;
    url: string;
  }>;
}

export const PageHead: React.FC<PageHeadProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  siteName = 'StarcoEX Platform',
  url,
  image,
  og,
  twitter,
  robots = 'index, follow',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = 'ko_KR',
  alternateLocales = [],
}) => {
  // 기본값 설정
  const defaultImage = image || '/images/default-og-image.jpg';
  const defaultUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonical && <link rel="canonical" href={canonical} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={robots} />

      {/* Open Graph 태그 */}
      <meta property="og:title" content={og?.title || title} />
      <meta
        property="og:description"
        content={og?.description || description || ''}
      />
      <meta property="og:image" content={og?.image || defaultImage} />
      <meta property="og:url" content={og?.url || defaultUrl} />
      <meta property="og:type" content={og?.type || 'website'} />
      <meta property="og:site_name" content={og?.siteName || siteName} />
      <meta property="og:locale" content={locale} />

      {/* 추가 Open Graph 태그 */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* 다국어 지원 */}
      {alternateLocales.map(({ locale: altLocale, url: altUrl }, index) => (
        <link key={index} rel="alternate" hrefLang={altLocale} href={altUrl} />
      ))}

      {/* Twitter Card 태그 */}
      <meta
        name="twitter:card"
        content={twitter?.card || 'summary_large_image'}
      />
      <meta
        name="twitter:title"
        content={twitter?.title || og?.title || title}
      />
      <meta
        name="twitter:description"
        content={twitter?.description || og?.description || description || ''}
      />
      <meta
        name="twitter:image"
        content={twitter?.image || og?.image || defaultImage}
      />
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && (
        <meta name="twitter:creator" content={twitter.creator} />
      )}

      {/* 추가 메타 태그 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />

      {/* 파비콘 */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default PageHead;
