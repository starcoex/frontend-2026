FROM node:20-alpine AS builder
WORKDIR /app

# 패키지 파일 복사 (NX 모노레포 구조 반영)
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm ci --legacy-peer-deps

# 소스 복사
COPY apps/admin-dashboard ./apps/admin-dashboard
COPY libs ./libs

# Vite 빌드 (환경변수 빌드 타임 주입)
ARG VITE_API_URL=https://api.starcoex.com
ARG VITE_APP_ENV=production

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN npx nx build admin-dashboard --configuration=production

# ================================
# Stage 2: 실행 환경 (백엔드와 다른 부분)
# 백엔드: node:alpine  /  프론트엔드: nginx:alpine
# ================================
FROM nginx:alpine AS runner

# 빌드 결과물만 복사
COPY --from=builder /app/apps/admin-dashboard/dist /usr/share/nginx/html

# SPA용 nginx 설정 복사
COPY apps/admin-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
