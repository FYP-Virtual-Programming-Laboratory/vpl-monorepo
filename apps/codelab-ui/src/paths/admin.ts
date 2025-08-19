const adminRoot = "/admin";

export const dashboard = () => `${adminRoot}`;
export const profile = () => `${adminRoot}/profile`;
export const runtimes = () => `${adminRoot}/runtimes`;
export const runtimeDetails = (runtimeId: string) =>
  `${runtimes()}/${runtimeId}`;
export const sessions = () => `${adminRoot}/sessions`;
export const sessionDetails = (sessionId: string) =>
  `${sessions()}/${sessionId}`;
export const sessionGradings = (sessionId: string) =>
  `${sessionDetails(sessionId)}/grading`;
export const studentGradeDetails = (sessionId: string, studentId: string) =>
  `${sessionGradings(sessionId)}/student/${studentId}`;
export const groupGradeDetails = (sessionId: string, groupId: string) =>
  `${sessionGradings(sessionId)}/group/${groupId}`;
export const settings = () => `${adminRoot}/settings`;
export const students = () => `${adminRoot}/students`;
export const systemMonitor = () => `${adminRoot}/monitor`;
