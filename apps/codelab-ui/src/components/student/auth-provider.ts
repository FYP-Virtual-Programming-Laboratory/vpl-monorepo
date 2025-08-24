import { login } from "@/api/student/auth";
import createAuthService from "@/components/create-auth-service";

const { AuthProvider, useAuth } = createAuthService({
  loginFn: async ({ username, password }) => {
    const data = await login({ username, password });
    return {
      token: data.token,
      user: data.profile,
    };
  },
});

export { AuthProvider as StudentAuthProvider, useAuth as useStudentAuth };
