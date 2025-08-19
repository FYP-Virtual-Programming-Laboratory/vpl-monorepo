const adminRoot = "/admin";

export const dashboard = () => adminRoot;
export const profile = () => `${adminRoot}/profile` as const;
export const runtimes = () => `${adminRoot}/runtimes` as const;
export const runtimeDetails = (runtimeId: string) =>
  `${runtimes()}/${runtimeId}` as const;
export const sessions = () => `${adminRoot}/sessions` as const;
export const sessionDetails = (sessionId: string) =>
  `${sessions()}/${sessionId}` as const;
export const sessionGradings = (sessionId: string) =>
  `${sessionDetails(sessionId)}/grading` as const;
export const studentGradeDetails = (sessionId: string, studentId: string) =>
  `${sessionGradings(sessionId)}/student/${studentId}` as const;
export const groupGradeDetails = (sessionId: string, groupId: string) =>
  `${sessionGradings(sessionId)}/group/${groupId}` as const;
export const settings = () => `${adminRoot}/settings` as const;
export const students = () => `${adminRoot}/students` as const;
export const systemMonitor = () => `${adminRoot}/monitor` as const;
