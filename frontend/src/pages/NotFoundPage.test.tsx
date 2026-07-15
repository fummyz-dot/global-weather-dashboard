import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { NotFoundPage } from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("404表示とダッシュボードへのリンクを提供する", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "都市が見つかりません" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ダッシュボードへ戻る" })).toHaveAttribute("href", "/");
  });
});
