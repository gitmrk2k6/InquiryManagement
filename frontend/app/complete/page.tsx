import Link from 'next/link';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function CompletePage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">お問い合わせ</h1>

        <div className="mb-6">
          <span className="text-4xl">✓</span>
          <p className="text-lg font-medium text-gray-900 mt-3">送信が完了しました</p>
        </div>

        <p className="text-sm text-gray-700 mb-2">お問い合わせを受け付けました。</p>
        <p className="text-sm text-gray-700 mb-6">内容を確認のうえ、担当者よりご連絡いたします。</p>

        {id && (
          <p className="text-sm text-gray-600 mb-8">
            受付番号: <span className="font-medium text-gray-900">{id}</span>
          </p>
        )}

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          新しいお問い合わせを送る
        </Link>
      </div>
    </div>
  );
}
