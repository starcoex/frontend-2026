// 403 Forbidden
import Error403_SVG from '../illustrations/403.svg';

// 404 Not Found
import Error404_SVG from '../illustrations/404.svg';

// 500 Server Error
import Error500_SVG from '../illustrations/500.svg';

export const ErrorImages = {
  error403: Error403_SVG,
  error404: Error404_SVG,
  error500: Error500_SVG,
} as const;

export type ErrorImageKey = keyof typeof ErrorImages;
