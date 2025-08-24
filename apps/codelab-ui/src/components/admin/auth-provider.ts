import { login } from "@/api/admin/auth";
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

export { AuthProvider as AdminAuthProvider, useAuth as useAdminAuth };
