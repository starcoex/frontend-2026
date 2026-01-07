import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // 쿠키 포함
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 대기 중인 요청 처리
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러 && 재시도 하지 않은 요청
    if (error.response?.status === 401 && !originalRequest._retry) {

      // 이미 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신 요청
        await axiosInstance.post('/graphql', {
          query: `
            mutation RefreshToken {
              refreshToken {
                accessToken
                refreshToken
                message
              }
            }
          `,
        });

        // 갱신 성공 → 대기 중인 요청들 재시도
        processQueue(null);

        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 → 로그인 페이지로
        processQueue(refreshError as Error);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
