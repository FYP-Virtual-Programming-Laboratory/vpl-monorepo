import { createApiCall, getAxiosInstance } from "../api";

type StudentProfile = {
  first_name: string;
  last_name: string;
  email: string;
  matric_number: string;
  last_login: string;
};

type StudentAuthDetails = {
  token: string;
  profile: StudentProfile;
};

export const login = createApiCall(
  async (params: { username: string; password: string }) => {
    const response = await getAxiosInstance().post(
      "/accounts/students/login",
      params
    );

    return response.data as StudentAuthDetails;
  }
);

export const signup = createApiCall(
  async (params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    matricNumber: string;
  }) => {
    const response = await getAxiosInstance().post("/accounts/students", {
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
      password: params.password,
      matric_number: params.matricNumber,
    });

    return response.data as StudentAuthDetails;
  }
);
