import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Uncaught application error", error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
        <section className="glass-card w-full max-w-xl rounded-3xl p-8 text-center" role="alert">
          <TriangleAlert className="mx-auto h-11 w-11 text-orange-300" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-white">画面を表示できませんでした</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            ページを再読み込みして、もう一度お試しください。
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-200"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            ページを再読み込み
          </button>
        </section>
      </main>
    );
  }
}
