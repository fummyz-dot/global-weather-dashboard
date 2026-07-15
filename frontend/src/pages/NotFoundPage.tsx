import { ArrowLeft, MapPinOff } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <section className="glass-card w-full max-w-xl rounded-3xl p-8 text-center sm:p-12">
        <MapPinOff className="mx-auto h-12 w-12 text-cyan-200" aria-hidden="true" />
        <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-cyan-200">404 NOT FOUND</p>
        <h1 className="mt-3 text-3xl font-bold text-white">都市が見つかりません</h1>
        <p className="mt-3 leading-7 text-slate-300">URLを確認するか、ダッシュボードから都市を選び直してください。</p>
        <Link to="/" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-200">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          ダッシュボードへ戻る
        </Link>
      </section>
    </main>
  );
}
