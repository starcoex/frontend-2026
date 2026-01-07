import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Frown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import React from 'react';
import { CardDescription, CardTitle } from '../ui/card';

export const NotFoundAnimation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md mx-auto px-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-8xl font-bold text-primary opacity-50">404</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <Frown className="h-6 w-6 text-muted-foreground" />
            <CardTitle className="text-2xl">
              페이지를 찾을 수 없습니다
            </CardTitle>
          </div>
          <CardDescription className="pb-4">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </CardDescription>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            홈으로 가기
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            이전 페이지
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
