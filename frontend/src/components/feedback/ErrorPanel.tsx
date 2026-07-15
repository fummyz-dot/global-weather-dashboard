import { RefreshCw, TriangleAlert } from "lucide-react";

interface ErrorPanelProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <section className="glass-card mx-auto max-w-2xl rounded-2xl p-8 text-center" role="alert">
      <TriangleAlert className="mx-auto h-10 w-10 text-orange-300" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-bold">天気データを取得できませんでした</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {message ?? "時間をおいて、もう一度お試しください。"}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-200"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        再試行
      </button>
    </section>
  );
}
