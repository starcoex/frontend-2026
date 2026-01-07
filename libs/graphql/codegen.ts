import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 🌐 Gateway Federation 스키마
  schema: ['http://localhost:4000/graphql'],

  // 📁 API 클라이언트의 GraphQL 문서들
  documents: ['src/lib/gql/**/*.ts', 'src/lib/gql/**/*.graphql'],

  // 🎯 생성할 파일들
  generates: {
    // TypeScript 타입 정의 및 SDK
    'src/lib/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo', // Apollo Client 기반으로 변경
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
        // Apollo Client 관련 설정
        withHooks: true, // React Hooks 생성
        withHOC: false,
        withComponent: false,
        withMutationFn: true,
        apolloReactCommonImportFrom: '@apollo/client',
        apolloReactHooksImportFrom: '@apollo/client',
        dedupeFragments: true,
        gqlImport: '@apollo/client#gql', // gql을 Apollo Client에서 import
      },
    },
  },

  // 🔧 글로벌 설정
  config: {
    skipTypename: false,
    enumsAsTypes: true,
  },
};

export default config;
