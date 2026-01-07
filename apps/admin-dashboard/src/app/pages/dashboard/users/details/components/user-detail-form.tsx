import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { IconTerminal } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Role } from '@starcoex-frontend/graphql';
import { useDialogState } from '@/hooks/use-dialog-state';
import { userToasts } from '@/components/ui/toast.helpers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { UsersDeactivateDialog } from '@/app/pages/dashboard/users/components/users-deactivate-dialog';
import { useAuth } from '@starcoex-frontend/auth'; // ✅ useAuth만 사용

interface Props {
  user: User;
  onUpdate?: () => void; // ✅ 업데이트 후 콜백
}

const accountDetailSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email is invalid.' }),
  role: z.string().min(1, { message: 'Role is required.' }),
});
type AccountDetailForm = z.infer<typeof accountDetailSchema>;

export function UserDetailForm({ user, onUpdate }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useDialogState<'reset' | 'deactivate'>(null);

  // ✅ useAuth에서 직접 가져오기
  const { currentUser, forgotPassword, updateUserByAdmin } = useAuth();

  const form = useForm<AccountDetailForm>({
    resolver: zodResolver(accountDetailSchema),
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
      role: user.role ?? '',
      phoneNumber: user.phoneNumber ?? '',
    },
  });

  const onSubmit = async (values: AccountDetailForm) => {
    try {
      // ✅ 실제 GraphQL mutation 호출
      const response = await updateUserByAdmin(Number(user.id), {
        name: values.name,
        phoneNumber: values.phoneNumber,
        role: values.role as Role,
        userId: Number(user.id),
        adminId: currentUser?.id as number,
        isActive: user.isActive ?? true,
        emailVerified: user.emailVerified ?? false,
      });

      if (response.success) {
        userToasts.update(user, { name: values.name });
        setIsEdit(false);
        onUpdate?.(); // ✅ 업데이트 후 콜백 호출
      }
    } catch (error) {
      console.error('User update failed:', error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      // ✅ useAuth의 forgotPassword 사용 (이메일만 전송)
      const response = await forgotPassword({ email: user.email });

      if (response.success) {
        userToasts.passwordResetSent(user);
        setOpen(null);
        // ✅ 현재 페이지에 유지 (navigate 제거)
      }
    } catch (error) {
      console.error('Password reset email failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 lg:flex-row">
      <Card className="w-full lg:max-w-2xl lg:flex-auto lg:basis-9/12">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overview
            <Badge>Status: {user.isActive ? 'Active' : 'Inactive'}</Badge>
          </CardTitle>
          <CardDescription>
            Profile details, including name, contact, role, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="user-edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-x-4 gap-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} readOnly={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2 space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
                        readOnly // ✅ 이메일은 항상 읽기 전용
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2 space-y-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number"
                        {...field}
                        readOnly={!isEdit}
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
                  <FormItem className="col-span-2 space-y-1">
                    <FormLabel>Role</FormLabel>
                    <FormDescription>
                      Indicates the user&apos;s assigned position and
                      corresponding permissions within the system.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                        disabled={!isEdit}
                      >
                        <FormItem className="flex items-center space-y-0 space-x-3">
                          <FormControl>
                            <RadioGroupItem value="SUPERADMIN" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Superadmin{' '}
                            <span className="text-muted-foreground text-sm">
                              (Full access to all features and settings.)
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-y-0 space-x-3">
                          <FormControl>
                            <RadioGroupItem value="ADMIN" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Admin{' '}
                            <span className="text-muted-foreground text-sm">
                              (Manage users, permissions, and content.)
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-y-0 space-x-3">
                          <FormControl>
                            <RadioGroupItem value="MANAGER" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Manager{' '}
                            <span className="text-muted-foreground text-sm">
                              (Oversee teams and manage related data.)
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-y-0 space-x-3">
                          <FormControl>
                            <RadioGroupItem value="USER" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            User{' '}
                            <span className="text-muted-foreground text-sm">
                              (Basic access to platform features.)
                            </span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert className="col-span-2">
                <IconTerminal className="h-4 w-4" />
                <AlertTitle>Last login at</AlertTitle>
                <AlertDescription>
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Never'}
                </AlertDescription>
              </Alert>
            </form>
          </Form>
        </CardContent>
        {isEdit && (
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEdit(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="user-edit-form">
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="w-full lg:w-auto lg:max-w-md lg:flex-initial lg:basis-3/12">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Manage necessary user actions including edit, resend email, and
            account deactivation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <span>Update Account Info</span>
                <span className="text-muted-foreground text-xs leading-snug font-normal">
                  Update the user info by turning the switch on.
                </span>
              </div>
              <Switch
                checked={isEdit}
                onCheckedChange={() => setIsEdit((prev) => !prev)}
                className="scale-125"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <span>Send Password Reset Email</span>
                <span className="text-muted-foreground text-xs leading-snug font-normal">
                  Sends a reset link to the user&apos;s registered email.
                </span>
              </div>
              <Button
                variant="outline"
                className="border-destructive/75 text-destructive hover:bg-destructive/10 hover:text-destructive/90 dark:border-red-500 dark:text-red-400 dark:hover:text-red-600"
                onClick={() => setOpen('reset')}
              >
                Send Email
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <span>Deactivate Account</span>
                <span className="text-muted-foreground text-xs leading-snug font-normal">
                  Disables the user&apos;s account, restricting access until
                  reactivated.
                </span>
              </div>
              <Button
                variant="destructive"
                onClick={() => setOpen('deactivate')}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        key="user-reset-password"
        open={open === 'reset'}
        onOpenChange={() => setOpen('reset')}
        handleConfirm={handlePasswordReset}
        className="max-w-md"
        title={`Send Reset Password Email?`}
        desc={
          <>
            You are about to send a reset password email to{' '}
            <strong>{user.email}</strong>.
            <br />
            <br />
            The user will receive an email with a link to reset their password.
          </>
        }
        confirmText="Send Email"
      />

      <UsersDeactivateDialog
        key={`user-deactivate-${user.id}`}
        open={open === 'deactivate'}
        onOpenChange={() => setOpen('deactivate')}
        currentRow={user}
        onSuccess={onUpdate} // ✅ 삭제 후 콜백 전달
      />
    </div>
  );
}
