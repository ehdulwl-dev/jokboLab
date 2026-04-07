import { ENV } from "../constants/env";
import type { ApiFailure, ApiResponse } from "../types/api";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

const toApiFailure = (error: unknown): ApiFailure => {
  if (error instanceof Error) {
    return {
      ok: false,
      error: {
        code: "UNEXPECTED_CLIENT_ERROR",
        message: error.message,
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "UNEXPECTED_CLIENT_ERROR",
      message: "Unexpected client error",
    },
  };
};

export const apiGet = async <T>(path: string, headers?: HeadersInit): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}${path}`, {
      method: "GET",
      headers: { ...defaultHeaders, ...headers },
    });

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    return toApiFailure(error);
  }
};

export const apiPost = async <T, B = unknown>(
  path: string,
  body: B,
  headers?: HeadersInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}${path}`, {
      method: "POST",
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(body),
    });

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    return toApiFailure(error);
  }
};
