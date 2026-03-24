import { useEffect, useState } from 'react';
import { useReservations } from '@starcoex-frontend/reservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import type { RefundPolicy } from '@starcoex-frontend/reservations';
import { RefundPolicyCreateDialog } from '@/app/pages/dashboard/ecommerce/reservations/services/components/refund-policy-create-dialog';
import { RefundPolicyEditDialog } from '@/app/pages/dashboard/ecommerce/reservations/services/components/refund-policy-edit-dialog';

export function RefundPolicyTab() {
  const { fetchRefundPolicies, deleteRefundPolicy, isLoading } =
    useReservations();
  const [policies, setPolicies] = useState<RefundPolicy[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<RefundPolicy | null>(null);

  const loadPolicies = () => {
    fetchRefundPolicies().then((res) => {
      if (res.success && res.data?.refundPolicies) {
        setPolicies(res.data.refundPolicies);
      }
    });
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleDelete = async (policy: RefundPolicy) => {
    if (
      !window.confirm(
        `"${policy.name}" 환불 정책을 삭제하시겠습니까?\n이 정책을 사용하는 서비스가 있으면 삭제되지 않습니다.`
      )
    )
      return;
    const res = await deleteRefundPolicy(policy.id);
    if (res.success) {
      toast.success('환불 정책이 삭제되었습니다.');
      loadPolicies();
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">환불 정책 목록</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadPolicies}>
            <RefreshCw className="mr-2 size-4" />
            새로고침
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            환불 정책 추가
          </Button>
        </div>
      </div>

      {isLoading && policies.length === 0 ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-muted-foreground text-sm">불러오는 중...</span>
        </div>
      ) : policies.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <ShieldCheck className="text-muted-foreground mx-auto mb-3 size-10" />
          <p className="text-muted-foreground text-sm">
            등록된 환불 정책이 없습니다.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            서비스 생성 전에 환불 정책을 먼저 만들어야 합니다.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 size-4" />첫 환불 정책 추가
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary size-4" />
                    <span>{policy.name}</span>
                    <Badge
                      variant={policy.allowRefund ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {policy.allowRefund ? '환불 허용' : '환불 불가'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setEditingPolicy(policy)}
                    >
                      <Edit className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(policy)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {policy.description && (
                  <p className="text-muted-foreground text-sm">
                    {policy.description}
                  </p>
                )}
                <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
                  <span>
                    최소 환불 금액: ₩
                    {policy.minimumRefundAmount.toLocaleString()}
                  </span>
                  <span>환불 수수료: ₩{policy.refundFee.toLocaleString()}</span>
                </div>
                {/* 환불 규칙 표시 */}
                {Array.isArray(policy.refundRules) &&
                  policy.refundRules.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium">환불 규칙</p>
                      <div className="flex flex-wrap gap-2">
                        {(policy.refundRules as any[]).map((rule, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {rule.hoursBeforeService}시간 전:{' '}
                            {(rule.refundRate * 100).toFixed(0)}% 환불
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RefundPolicyCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={loadPolicies}
      />
      <RefundPolicyEditDialog
        open={!!editingPolicy}
        onOpenChange={(open) => !open && setEditingPolicy(null)}
        policy={editingPolicy}
        onSuccess={loadPolicies}
      />
    </div>
  );
}
