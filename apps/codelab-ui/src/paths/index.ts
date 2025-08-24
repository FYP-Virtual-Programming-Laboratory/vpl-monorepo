export * as adminPaths from "./admin";
export * as studentPaths from "./student";

export const home = () => "/" as const;
export const adminLogin = () => "/auth/admin" as const;
export const studentLogin = () => "/auth/student" as const;
export const studentSignup = () => "/auth/student/create" as const;
