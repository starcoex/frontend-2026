import React from 'react';

interface WelcomeBannerProps {
  userName: string;
  tier?: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '안녕하세요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '안녕하세요';
  if (hour < 22) return '좋은 저녁이에요';
  return '안녕하세요';
};

const getFormattedDate = () => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
};

const TIER_EMOJI: Record<string, string> = {
  WELCOME: '🌟',
  SHINE: '✨',
  STAR: '⭐',
};

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  tier,
}) => {
  const emoji = tier ? TIER_EMOJI[tier] ?? '🌟' : '🌟';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{getFormattedDate()}</p>
        <h1 className="text-2xl font-bold">
          {getGreeting()}, <span className="text-primary">{userName}</span>님!
          👋
        </h1>
        {tier && (
          <p className="text-sm text-muted-foreground">
            현재 등급:{' '}
            <span className="font-semibold text-foreground">{tier}</span>
          </p>
        )}
      </div>
      <div className="text-4xl select-none">{emoji}</div>
    </div>
  );
};
