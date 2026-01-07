// Starcoex
import Star_Logo_SVG from './company/SVG/Starcoex.svg';
import Star_Logo_PNG from './company/PNG/starcoex.png';

// StarOil
import StarOil_Logo_SVG from './company/SVG//StarOil.svg';
import StarOil_Logo_PNG from './company/PNG/StarOil.png';

// Delivery
import StarOil_Delivery_Logo_SVG from './company/SVG/Starcoex-Word.svg';
import StarOil_Delivery_Logo_PNG from './company/PNG/Starcoex-Word.png';

// Zeragae
import Zeragae_Logo_SVG from './company/SVG/Zeragae.svg';
import Zeragae_Logo_PNG from './company/PNG/Zeragae.png';

// 📱 소셜 로그인 버튼 이미지
import btnKakao from './social/btn_kakao.svg';
import btnNaver from './social/btn_naver.svg';
import btnGoogle from './social/btn_google.svg';
import btnApple from './social/btn_apple.svg';

export const Logos = {
  starcoex: {
    svg: Star_Logo_SVG,
    png: Star_Logo_PNG,
  },
  staroil: {
    svg: StarOil_Logo_SVG,
    png: StarOil_Logo_PNG,
  },
  delivery: {
    svg: StarOil_Delivery_Logo_SVG,
    png: StarOil_Delivery_Logo_PNG,
  },
  zeragae: {
    svg: Zeragae_Logo_SVG,
    png: Zeragae_Logo_PNG,
  },
  kakao: {
    svg: btnKakao,
    png: '',
  },
  naver: {
    svg: btnNaver,
    png: '',
  },
  google: {
    svg: btnGoogle,
    png: '',
  },
  apple: {
    svg: btnApple,
    png: '',
  },
} as const;

export type LogoKind = keyof typeof Logos;
export type LogoFormat = 'svg' | 'png';
