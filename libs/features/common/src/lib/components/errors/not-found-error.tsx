import { Button } from '../ui';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFoundError = () => {
  const navigate = useNavigate();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">404</h1>
        <span className="font-medium">
          죄송합니다! 페이지를 찾을수 없습니다!
        </span>
        <p className="text-muted-foreground text-center text-sm">
          찾으시는 페이지가 <br />
          존재하지 않거나 삭제된 것 같습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button size="lg" variant="outline" onClick={() => navigate(-1)}>
            돌아가기 <ArrowRight className="ms-2 h-4 w-4" />
          </Button>
          <Button asChild>
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
