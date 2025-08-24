import { AUTH_TOKEN_KEY } from "@/constants";
import { env } from "@/env";
import axios, { AxiosInstance, isAxiosError } from "axios";

const apiMap: Record<string, AxiosInstance> = {};

export function getAxiosInstance(prefix = "/api/v1") {
  if (apiMap[prefix]) return apiMap[prefix];

  const apiBaseUrl = env.NEXT_PUBLIC_API_URL;

  apiMap[prefix] = axios.create({
    baseURL: apiBaseUrl + prefix,
  });

  apiMap[prefix].interceptors.request.use((config) => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (token) config.headers.set("Authorization", `Bearer ${token}`);

    return config;
  });

  return apiMap[prefix];
}

type AsyncFunction<TParams = unknown, TResult = unknown> = (
  params: TParams
) => Promise<TResult>;

export function createApiCall<TParams, TResult>(
  fn: AsyncFunction<TParams, TResult>
) {
  return async function (params: TParams) {
    try {
      return await fn(params);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          // Error from server response
          if (error.response.status === 442) {
            throw new Error(
              error.response.data.detail?.[0]?.["msg"] ||
                "You sent invalid data."
            );
          }
        }
      }

      throw error;
    }
  };
}
