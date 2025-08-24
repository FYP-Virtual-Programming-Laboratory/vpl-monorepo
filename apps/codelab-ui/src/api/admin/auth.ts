import { createApiCall, getAxiosInstance } from "../api";

export const login = createApiCall(
  async (params: { username: string; password: string }) => {
    const response = await getAxiosInstance().post("/accounts/admins/login", {
      email: params.username,
      password: params.password,
    });

    return response.data as {
      token: string;
      profile: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        is_active: boolean;
        last_login: string;
      };
    };
  }
);
