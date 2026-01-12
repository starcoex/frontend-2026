import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { IconMailPlus, IconSend, IconLoader2 } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { userTypes } from '../data/data';
import { userToasts } from '@/components/ui/toast.helpers';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SelectDropdown from '@/components/select-dropdown';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@starcoex-frontend/auth'; // ✅ useAuth만 사용
import { Role } from '@starcoex-frontend/graphql';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // ✅ 성공 콜백을 prop으로 받음
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email is invalid.' }),
  role: z.string().min(1, { message: 'Role is required.' }),
  userType: z.enum(['BUSINESS', 'INDIVIDUAL']), // ✅ userType 필드 추가
  desc: z.string().optional(),
});
type UserInviteForm = z.infer<typeof formSchema>;

export function UsersInviteDialog({ open, onOpenChange, onSuccess }: Props) {
  const { inviteUser } = useAuth(); // ✅ useAuth에서 직접 가져오기

  // ✅ 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: '', userType: 'INDIVIDUAL', desc: '' }, // ✅ 기본값 설정
  });

  const onSubmit = async (values: UserInviteForm) => {
    // ✅ 에러 초기화
    setError(null);
    setIsSubmitting(true);

    try {
      // ✅ 실제 GraphQL mutation 호출
      const response = await inviteUser({
        email: values.email,
        role: values.role as Role,
        userType: values.userType, // ✅ 문자열로 직접 사용
        adminMessage: values.desc,
      });

      if (response.success) {
        userToasts.invite(values);
        form.reset();
        onOpenChange(false);
        onSuccess?.(); // ✅ 성공 시 콜백 호출
      } else {
        // ✅ 실패 - 에러 메시지 추출
        const errorMsg =
          response.error?.message ||
          response.graphQLErrors?.[0]?.message ||
          '초대 발송에 실패했습니다.';

        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      // ✅ 예외 처리
      const errorMsg =
        err instanceof Error
          ? err.message
          : '초대 발송 중 알 수 없는 오류가 발생했습니다.';

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        setError(null); // ✅ 다이얼로그 닫을 때 에러 초기화
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <IconMailPlus /> Invite User
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ 에러 표시 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-lg hover:opacity-70"
              >
                ✕
              </button>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            id="user-invite-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="eg: john.doe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a role"
                    items={userTypes.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>User Type</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select user type"
                    items={[
                      { label: 'Individual', value: 'INDIVIDUAL' },
                      { label: 'Business', value: 'BUSINESS' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Add a personal note to your invitation (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="user-invite-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <IconLoader2 />
                Sending...
              </>
            ) : (
              <>
                Invite <IconSend />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
