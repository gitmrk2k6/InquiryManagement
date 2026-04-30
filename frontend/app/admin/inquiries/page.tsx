'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type InquiryStatus = 'open' | 'in_progress' | 'closed';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: InquiryStatus;
  receivedAt: string;
}

interface ApiResponse {
  data: Inquiry[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_LABEL: Record<InquiryStatus, string> = {
  open: '未対応',
  in_progress: '対応中',
  closed: '完了',
};

const STATUS_ICON: Record<InquiryStatus, string> = {
  open: '🔴',
  in_progress: '🟡',
  closed: '🟢',
};

function elapsedDays(receivedAt: string): number {
  return Math.floor((Date.now() - new Date(receivedAt).getTime()) / 86400000);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function InquiryListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openCount, setOpenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const status = (searchParams.get('status') ?? '') as InquiryStatus | '';
  const sort = searchParams.get('sort') ?? 'newest';
  const page = Number(searchParams.get('page') ?? '1');

  const updateQuery = useCallback(
    (params: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v) next.set(k, v); else next.delete(k);
      });
      next.set('page', '1');
      router.push(`/admin/inquiries?${next.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ sort, page: String(page) });
        if (status) params.set('status', status);

        const res = await fetch(`http://localhost:3001/inquiries?${params}`, {
          credentials: 'include',
        });
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!res.ok) throw new Error();

        const json: ApiResponse = await res.json();
        setInquiries(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
        setOpenCount(json.data.filter((i) => i.status === 'open').length);
      } catch {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [status, sort, page, router]);

  async function handleLogout() {
    await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900">問い合わせ管理システム</h1>
          {openCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
              未対応: {openCount} 件
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-3 py-1"
        >
          ログアウト
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-600 block mb-1">フィルター</label>
            <select
              value={status}
              onChange={(e) => updateQuery({ status: e.target.value })}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900"
            >
              <option value="">全て</option>
              <option value="open">未対応</option>
              <option value="in_progress">対応中</option>
              <option value="closed">完了</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">ソート</label>
            <select
              value={sort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900"
            >
              <option value="newest">受信日時（新しい順）</option>
              <option value="oldest">受信日時（古い順）</option>
              <option value="elapsed">経過日数（長い順）</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">読み込み中...</p>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['受付番号', '受信日時', '氏名', '件名', 'ステータス', '経過日数'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center px-4 py-8 text-gray-500">
                        該当する問い合わせはありません
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inquiry) => {
                      const days = elapsedDays(inquiry.receivedAt);
                      const highlight = inquiry.status === 'open' && days > 3;
                      return (
                        <tr
                          key={inquiry.id}
                          onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                          className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${highlight ? 'bg-red-50' : ''}`}
                        >
                          <td className="px-4 py-3 text-gray-900">{String(inquiry.id).padStart(3, '0')}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(inquiry.receivedAt)}</td>
                          <td className="px-4 py-3 text-gray-900">{inquiry.name}</td>
                          <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{inquiry.subject}</td>
                          <td className="px-4 py-3">
                            <span className="whitespace-nowrap">
                              {STATUS_ICON[inquiry.status]} {STATUS_LABEL[inquiry.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{days}日</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams.toString());
                      next.set('page', String(p));
                      router.push(`/admin/inquiries?${next.toString()}`);
                    }}
                    className={`px-3 py-1 rounded text-sm border ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3 text-center">全 {total} 件</p>
          </>
        )}
      </main>
    </div>
  );
}
