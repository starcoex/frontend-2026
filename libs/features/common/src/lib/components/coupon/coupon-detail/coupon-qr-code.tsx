import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { cn } from '../../../utils';

interface CouponQRCodeProps {
  data: string;
  size?: number;
  className?: string;
}

export const CouponQRCode: React.FC<CouponQRCodeProps> = ({
  data,
  size = 200,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    }
  }, [data, size]);

  return (
    <div
      className={cn(
        'flex items-center justify-center p-4 bg-white rounded-xl shadow-inner',
        className
      )}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
