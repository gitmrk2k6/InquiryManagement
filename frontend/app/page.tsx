'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  body: string;
  website: string; // honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  body?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'お名前を入力してください';
  else if (values.name.trim().length > 255) errors.name = '255文字以内で入力してください';

  if (!values.email.trim()) errors.email = 'メールアドレスを入力してください';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = '正しいメールアドレスを入力してください';
  else if (values.email.length > 255) errors.email = '255文字以内で入力してください';

  if (!values.subject.trim()) errors.subject = '件名を入力してください';
  else if (values.subject.trim().length > 100) errors.subject = '100文字以内で入力してください';

  if (!values.body.trim()) errors.body = 'お問い合わせ内容を入力してください';
  else if (values.body.trim().length > 2000) errors.body = '2000文字以内で入力してください';

  return errors;
}

export default function InquiryFormPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ name: '', email: '', subject: '', body: '', website: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    if (values.website) return;

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          body: values.body.trim(),
        }),
      });

      if (res.status === 429) {
        setServerError('送信回数の制限に達しました。しばらくお待ちください');
        return;
      }
      if (!res.ok) {
        setServerError('送信に失敗しました。時間をおいて再度お試しください');
        return;
      }

      const data = await res.json();
      router.push(`/complete?id=${data.id}`);
    } catch {
      setServerError('送信に失敗しました。時間をおいて再度お試しください');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">お問い合わせ</h1>

        {serverError && (
          <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <input type="text" name="website" value={values.website} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

          {[
            { name: 'name', label: 'お名前', type: 'text', required: true },
            { name: 'email', label: 'メールアドレス', type: 'email', required: true },
            { name: 'subject', label: '件名', type: 'text', required: true },
          ].map(({ name, label, type, required }) => (
            <div key={name} className="mb-5">
              <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={values[name as keyof FormValues]}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name as keyof FormErrors] ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors[name as keyof FormErrors] && (
                <p className="mt-1 text-xs text-red-600">{errors[name as keyof FormErrors]}</p>
              )}
            </div>
          ))}

          <div className="mb-7">
            <label htmlFor="body" className="block text-sm font-medium text-gray-900 mb-1">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              value={values.body}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${errors.body ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '送信中...' : '送信する'}
          </button>
        </form>
      </div>
    </div>
  );
}
