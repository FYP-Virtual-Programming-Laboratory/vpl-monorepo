import { createApiCall, getAxiosInstance } from "../api";

export const login = createApiCall(
  async (params: { username: string; password: string }) => {
    const response = await getAxiosInstance().post(
      "/accounts/students/login",
      params
    );

    return response.data as {
      token: string;
      profile: {
        first_name: string;
        last_name: string;
        email: string;
        matric_number: string;
        last_login: string;
      };
    };
  }
);
