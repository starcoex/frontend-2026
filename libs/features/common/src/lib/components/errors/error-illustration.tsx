import React from 'react';
import { ErrorImages, type ErrorImageKey } from '../../errors';

interface ErrorIllustrationProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  type: ErrorImageKey; // 'error403' | 'error404' | 'error500'
}

export const ErrorIllustration: React.FC<ErrorIllustrationProps> = ({
  type,
  alt,
  ...rest
}) => {
  const src = ErrorImages[type];
  const defaultAlt =
    alt ||
    (type === 'error403'
      ? '403 Forbidden'
      : type === 'error404'
      ? '404 Not Found'
      : '500 Server Error');

  return <img src={src} alt={defaultAlt} {...rest} />;
};
