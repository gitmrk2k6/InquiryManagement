'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

type InquiryStatus = 'open' | 'in_progress' | 'closed';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: InquiryStatus;
  receivedAt: string;
}

const STATUS_OPTIONS: { value: InquiryStatus; label: string; icon: string }[] = [
  { value: 'open', label: '未対応', icon: '🔴' },
  { value: 'in_progress', label: '対応中', icon: '🟡' },
  { value: 'closed', label: '完了', icon: '🟢' },
];

function elapsedDays(receivedAt: string): number {
  return Math.floor((Date.now() - new Date(receivedAt).getTime()) / 86400000);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function InquiryDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState<InquiryStatus>('open');
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/inquiries/${id}`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data: Inquiry = await res.json();
      setInquiry(data);
      setStatus(data.status);
    }
    load();
  }, [id, router]);

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      const res = await fetch(`${API_URL}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated: Inquiry = await res.json();
      setInquiry(updated);
      setSaved(true);
    } catch {
      setSaveError('更新に失敗しました。再度お試しください');
    } finally {
      setSaving(false);
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 mb-4">お探しの問い合わせが見つかりませんでした</p>
          <Link href="/admin/inquiries" className="text-blue-600 text-sm hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const statusChanged = status !== inquiry.status;
  const currentOption = STATUS_OPTIONS.find((o) => o.value === inquiry.status)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">問い合わせ管理システム</h1>
        <button
          onClick={async () => {
            await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
            router.push('/admin/login');
          }}
          className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-3 py-1"
        >
          ログアウト
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← 一覧に戻る
        </Link>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              <span className="font-medium text-gray-900">受付番号: {String(inquiry.id).padStart(3, '0')}</span>
              <span className="mx-3 text-gray-300">|</span>
              受信日時: {formatDate(inquiry.receivedAt)}
            </div>
            <span className="text-sm text-gray-600">経過日数: {elapsedDays(inquiry.receivedAt)}日</span>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 space-y-3">
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 w-24 shrink-0">氏名</span>
              <span className="text-sm text-gray-900">{inquiry.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 w-24 shrink-0">メール</span>
              <span className="text-sm text-gray-900">{inquiry.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 w-24 shrink-0">件名</span>
              <span className="text-sm text-gray-900">{inquiry.subject}</span>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-2">お問い合わせ内容</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{inquiry.body}</p>
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-gray-500 mb-3">ステータス</p>
            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value as InquiryStatus); setSaved(false); }}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.icon} {o.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSave}
                disabled={!statusChanged || saving}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '保存中...' : '保存する'}
              </button>
              {saved && <span className="text-sm text-green-600">保存しました</span>}
              {saveError && <span className="text-sm text-red-600">{saveError}</span>}
            </div>
            {!statusChanged && (
              <p className="text-xs text-gray-400 mt-2">
                現在のステータス: {currentOption.icon} {currentOption.label}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
