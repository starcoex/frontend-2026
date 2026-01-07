import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  EMAIL_CONSTANTS,
  generateEmailPreview,
  sendContactEmail,
  validateContactForm,
} from '@starcoex-frontend/common';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const formFields = [
  {
    label: '이름',
    name: 'fullName',
    placeholder: '이름을 입력해주세요',
    type: 'text',
    required: true,
  },
  {
    label: '이메일 주소',
    name: 'email',
    placeholder: '이메일을 입력해주세요',
    type: 'email',
    required: true,
  },
  {
    label: '전화번호',
    name: 'phone',
    placeholder: '전화번호를 입력해주세요',
    type: 'tel',
    optional: true,
  },
  {
    label: '회사명',
    name: 'company',
    placeholder: '회사명을 입력해주세요',
    type: 'text',
    optional: true,
  },
  {
    label: '메시지',
    name: 'message',
    placeholder: '문의사항을 입력해주세요',
    type: 'textarea',
    required: true,
  },
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export default function GasStationContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      toast.error(EMAIL_CONSTANTS.MESSAGES.VALIDATION_ERROR, {
        description: validation.errors.join('\n'),
      });
      return;
    }

    setIsLoading(true);

    try {
      // 개발 환경에서 이메일 미리보기 (콘솔)
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email Preview:');
        console.log(generateEmailPreview(formData));
      }

      // 이메일 전송
      const result = await sendContactEmail(
        formData,
        EMAIL_CONSTANTS.RECIPIENTS.GENERAL
      );

      if (result.success) {
        toast.success('문의가 접수되었습니다!', {
          description: EMAIL_CONSTANTS.MESSAGES.SUCCESS,
        });

        // 폼 초기화
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          message: '',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('전송에 실패했습니다', {
        description: EMAIL_CONSTANTS.MESSAGES.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0">
      <div className="container px-0">
        <div className="border-b-dark-gray border-r-dark-gray border-l-dark-gray border-r border-b border-l">
          <div className="md:grid md:grid-cols-[80px_minmax(0,1fr)_80px]">
            <div className="border-r-dark-gray hidden w-[80px] border-r md:block"></div>

            <div>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2">
                {formFields.map((field, idx) => {
                  const isTextarea = field.type === 'textarea';
                  const isFirstCol = idx % 2 === 0;
                  const wrapperClasses = cn(
                    'border-b border-b-dark-gray',
                    !isTextarea &&
                      isFirstCol &&
                      'md:border-r md:border-r-dark-gray',
                    isTextarea && 'md:col-span-2'
                  );

                  return (
                    <div key={field.name} className={wrapperClasses}>
                      {isTextarea ? (
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={formData[field.name as keyof FormData]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="focus:placeholder:text-muted-foreground text-foreground placeholder:text-foreground h-60 w-full resize-none rounded-none border-0 bg-transparent placeholder-white shadow-none focus-visible:ring-0"
                        />
                      ) : (
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name as keyof FormData]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="focus:placeholder:text-muted-foreground text-foreground placeholder:text-foreground h-20 w-full rounded-none border-0 bg-transparent placeholder-white shadow-none focus-visible:ring-0"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="border-dark-gray h-20 w-full rounded-none border hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isLoading ? '전송 중...' : '메시지 전송'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-l-dark-gray hidden w-[80px] border-l md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
