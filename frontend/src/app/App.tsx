import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({ default: module.DashboardPage })),
);
const CityDetailPage = lazy(() =>
  import("../pages/CityDetailPage").then((module) => ({ default: module.CityDetailPage })),
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen" aria-label="ページを読み込み中" />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cities/:slug" element={<CityDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
