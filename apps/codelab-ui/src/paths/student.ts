const studentRoot = "/student";

export const grades = () => `${studentRoot}/grades` as const;
export const profile = () => `${studentRoot}/profile` as const;
export const sessions = () => `${studentRoot}/sessions` as const;
export const sessionDetails = (sessionId: string) =>
  `${sessions()}/${sessionId}` as const;
export const sessionExercise = (sessionId: string, exerciseId: string) =>
  `${sessionDetails(sessionId)}/exercises/${exerciseId}` as const;
export const sessionGrades = (sessionId: string) =>
  `${sessionDetails(sessionId)}/grades` as const;
export const sessionGroups = (sessionId: string) =>
  `${sessionDetails(sessionId)}/groups` as const;
export const sessionSolution = (sessionId: string, questionId: string) =>
  `${sessionExercise(sessionId, questionId)}/solution` as const;
export const settings = () => `${studentRoot}/settings` as const;
