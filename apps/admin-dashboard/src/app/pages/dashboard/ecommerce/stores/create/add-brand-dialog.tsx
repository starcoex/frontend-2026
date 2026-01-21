import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useStores } from '@starcoex-frontend/stores';
import { useAuth } from '@starcoex-frontend/auth';
import { Switch } from '@/components/ui/switch';

interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  brandColor: string;
  isActive: boolean;
}

export function AddBrandDialog() {
  const { createBrand, fetchBrands } = useStores();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    brandColor: '#000000',
    isActive: true,
  });

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error('브랜드명과 Slug는 필수 입력 항목입니다.');
      return;
    }

    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createBrand({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        logoUrl: formData.logoUrl || undefined,
        brandColor: formData.brandColor || undefined,
        isActive: formData.isActive,
      });

      if (response.success && response.data) {
        toast.success('브랜드가 성공적으로 등록되었습니다!');

        // 브랜드 목록 새로고침
        await fetchBrands();

        // 폼 초기화 및 다이얼로그 닫기
        setFormData({
          name: '',
          slug: '',
          description: '',
          logoUrl: '',
          brandColor: '#000000',
          isActive: true,
        });
        setOpen(false);
      } else {
        toast.error(response.error?.message || '브랜드 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Brand creation error:', error);
      toast.error('브랜드 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" type="button">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>새 브랜드 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">브랜드명 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="예: 스타코엑스"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="starcoex"
              />
              <p className="text-xs text-muted-foreground">
                URL에 사용될 고유 식별자입니다.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="브랜드 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logoUrl">로고 URL</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))
                }
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brandColor">브랜드 컬러</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="brandColor"
                  type="color"
                  value={formData.brandColor}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      brandColor: e.target.value,
                    }))
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.brandColor}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      brandColor: e.target.value,
                    }))
                  }
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">활성화</Label>
                <p className="text-xs text-muted-foreground">
                  브랜드 활성화 여부
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
