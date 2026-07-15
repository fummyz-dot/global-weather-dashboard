import { ExternalLink, Github } from "lucide-react";

import type { DataSource } from "../../types/weather";
import { formatGeneratedAt } from "../../utils/dateTime";

interface SiteFooterProps {
  generatedAt?: string;
  source?: DataSource;
}

export function SiteFooter({ generatedAt, source }: SiteFooterProps) {
  const repositoryUrl =
    import.meta.env.VITE_GITHUB_REPOSITORY_URL?.trim() ||
    "https://github.com/fummyz-dot/global-weather-dashboard";
  const sourceUrl = source?.url ?? "https://open-meteo.com/";
  return (
    <footer className="mt-16 border-t border-slate-400/15 py-8 text-sm text-slate-400">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-x-2">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-medium text-cyan-200 hover:text-cyan-100"
            >
              Weather data provided by {source?.name ?? "Open-Meteo"}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://open-meteo.com/en/license"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-cyan-200 hover:text-cyan-100"
            >
              CC BY 4.0
            </a>
          </div>
          <p className="max-w-2xl text-xs leading-5">
            表示値は読みやすい形式へ整形し、高温レベルは本アプリ独自に算出しています。
          </p>
          <p>データ取得日時: {formatGeneratedAt(generatedAt)}</p>
        </div>
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 font-medium text-slate-200 hover:text-white md:self-auto"
        >
          <Github className="h-[18px] w-[18px]" aria-hidden="true" />
          GitHub リポジトリ
        </a>
      </div>
    </footer>
  );
}
