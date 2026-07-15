import type { ApiErrorResponse } from "../types/weather";
import type { ZodType } from "zod";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!value) {
    throw new ApiError(
      "VITE_API_BASE_URLが設定されていません。",
      0,
      "API_URL_NOT_CONFIGURED",
    );
  }
  return value.endsWith("/") ? value : `${value}/`;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return false;
  }
  const error = value.error;
  return typeof error === "object" && error !== null;
}

export async function getJson<T>(
  path: string,
  schema: ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, getApiBaseUrl());

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError("APIへ接続できませんでした。", 0, "NETWORK_ERROR");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      "APIから読み取れない応答が返されました。",
      response.status,
      "INVALID_JSON",
    );
  }

  if (!response.ok) {
    const apiError = isApiErrorResponse(payload) ? payload.error : undefined;
    throw new ApiError(
      apiError?.message ?? "天気データを取得できませんでした。",
      response.status,
      apiError?.code,
    );
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ApiError(
      "APIの応答形式が想定と異なります。",
      response.status,
      "INVALID_RESPONSE",
    );
  }
  return result.data;
}
