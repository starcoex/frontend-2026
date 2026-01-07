import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userTypes } from '../data/data';
import { User, Role } from '@starcoex-frontend/graphql'; // ✅ GraphQL 타입 사용
import { userToasts } from '@/components/ui/toast.helpers';
import {
  Dialog,
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
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@starcoex-frontend/auth';

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // ✅ 추가
}

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required.' }),
    phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Email is invalid.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: 'Role is required.' }),
    userType: z.enum(['BUSINESS', 'INDIVIDUAL']), // ✅ userType 필드 추가
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password !== '')) {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        });
      }

      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        });
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        });
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        });
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        });
      }
    }
  });
type UserForm = z.infer<typeof formSchema>;

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow;
  const { currentUser, register, updateUserByAdmin } = useAuth(); // ✅ 직접 사용

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          username: currentRow.name || '',
          email: currentRow.email || '',
          role: currentRow.role || '',
          phoneNumber: currentRow.phoneNumber || '',
          userType:
            (currentRow.userType as 'BUSINESS' | 'INDIVIDUAL') || 'INDIVIDUAL', // ✅ 추가
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          userType: 'INDIVIDUAL', // ✅ 기본값

          password: '',
          confirmPassword: '',
          isEdit: false,
        },
  });

  const onSubmit = async (values: UserForm) => {
    try {
      if (isEdit && currentRow) {
        const response = await updateUserByAdmin(Number(currentRow.id), {
          name: values.username,
          phoneNumber: values.phoneNumber,
          role: values.role as Role,
          userId: Number(currentRow.id),
          adminId: currentUser?.id as number,
          isActive: true,
          emailVerified: true,
        });

        if (response.success) {
          userToasts.update(currentRow, { name: values.username });
          form.reset();
          onOpenChange(false);
          onSuccess?.(); // ✅ 성공 콜백 호출
        }
      } else {
        // ✅ 신규 생성: register 함수 사용
        const response = await register({
          email: values.email,
          password: values.password,
          name: values.username,
          phoneNumber: values.phoneNumber,
          role: values.role as Role,
          userType: values.userType, // ✅ 문자열로 직접 사용
          termsAccepted: true,
          rememberMe: false,
        });

        if (response.success) {
          userToasts.create({
            email: values.email,
            name: values.username,
            role: values.role as Role, // ✅ Role로 타입 캐스팅
          });
          form.reset();
          onOpenChange(false);
          onSuccess?.(); // ✅ 성공 콜백 호출
        }
      }
    } catch (error) {
      console.error('User action failed:', error);
    }
  };
  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                  <FormLabel className="col-span-2 text-right">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john_doe"
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                  <FormLabel className="col-span-2 text-right">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@gmail.com"
                      className="col-span-4"
                      disabled={isEdit} // 수정시 이메일 변경 불가
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                  <FormLabel className="col-span-2 text-right">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+123456789"
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                  <FormLabel className="col-span-2 text-right">Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a role"
                    className="col-span-4"
                    items={userTypes.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                  <FormLabel className="col-span-2 text-right">
                    User Type
                  </FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select user type"
                    className="col-span-4"
                    items={[
                      { label: 'Individual', value: 'INDIVIDUAL' },
                      { label: 'Business', value: 'BUSINESS' },
                    ]}
                  />
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            {/* 비밀번호 필드는 신규 생성시만 필수 */}
            {!isEdit && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                      <FormLabel className="col-span-2 text-right">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="********"
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 space-y-0 gap-y-1">
                      <FormLabel className="col-span-2 text-right">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={!isPasswordTouched}
                          placeholder="********"
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              </>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="user-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
