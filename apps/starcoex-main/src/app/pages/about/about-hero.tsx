import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface AboutHeroProps {
  title: string;
  subtitle?: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ title, subtitle }) => {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors">
            홈
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-muted-foreground text-base md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
