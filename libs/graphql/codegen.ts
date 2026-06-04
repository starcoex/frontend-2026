import { CodegenConfig } from '@graphql-codegen/cli';

// ─── 환경별 Gateway URL ───────────────────────────────────────────────────────
// vite.config.ts 와 동일한 기준으로 분리
const isDev = process.env.NODE_ENV !== 'production';
const GATEWAY_URL =
  process.env.CODEGEN_SCHEMA_URL ?? 'http://192.168.100.30:30090/graphql';

const config: CodegenConfig = {
  // 🌐 Federation Gateway 스키마 (단일 진입점)
  schema: [
    {
      [GATEWAY_URL]: {
        headers: {
          // ✅ CSRF 방어 헤더 (vite.config.ts proxy 설정과 동일)
          'apollo-require-preflight': 'true',
          'x-app-name': 'admin-dashboard',
          'x-client-version': '1.0.0',
        },
      },
    },
  ],

  // 📁 실제 monorepo 구조에 맞는 GQL 문서 경로
  documents: [
    // libs/graphql 패키지 내 모든 GQL 정의
    '../../libs/graphql/src/**/*.ts',
    '../../libs/graphql/src/**/*.graphql',
    // features 내 GQL 정의 (각 도메인 서비스)
    '../../libs/features/**/src/**/*.ts',
    '../../libs/features/**/src/**/*.graphql',
    // admin-dashboard 앱 내 GQL 정의
    'src/**/*.ts',
    'src/**/*.graphql',
    // 생성된 파일은 제외
    '!src/lib/generated/**/*',
    '!../../libs/graphql/src/index.ts',
  ],

  // 🎯 생성할 파일
  generates: {
    // ✅ libs/graphql 패키지에 타입 생성 (공유 타입)
    '../../libs/graphql/src/lib/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        avoidOptionals: false,
        scalars: {
          DateTime: 'string',
          Date: 'string',
          JSON: 'any',
          Upload: 'File',
        },
        namingConvention: {
          typeNames: 'pascal-case#pascalCase',
          transformUnderscore: true,
        },
        // Apollo Client 설정
        withHooks: true,
        withHOC: false,
        withComponent: false,
        withMutationFn: true,
        apolloReactCommonImportFrom: '@apollo/client/react',
        apolloReactHooksImportFrom: '@apollo/client/react',
        dedupeFragments: true,
        gqlImport: '@apollo/client#gql',
        // ✅ Federation 관련
        skipTypename: false,
        enumsAsTypes: true,
        // ✅ 타입 안전성
        strictScalars: false,
        nonOptionalTypename: false,
      },
    },
  },

  // 🔧 글로벌 설정
  config: {
    skipTypename: false,
    enumsAsTypes: true,
  },

  // ✅ 스키마 로드 실패 시 중단하지 않음 (오프라인 개발 대응)
  ignoreNoDocuments: true,
};

export default config;
