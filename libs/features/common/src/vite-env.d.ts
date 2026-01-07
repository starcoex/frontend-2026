/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTONE_STORE_ID: string;
  readonly VITE_PORTONE_CHANNEL_KEY: string;
  // 다른 환경 변수들도 여기에 추가 가능
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
