import { getApolloClient } from "@/apollo-client";
import {
  ADD_PROJECT_MEMBER_MUTATION,
  CREATE_PROJECT_MUTATION,
  REMOVE_PROJECT_MEMBER_MUTATION,
  UPDATE_PROJECT_MUTATION,
} from "@/gql/mutations";
import {
  GET_PROJECT_CONTRIBUTIONS,
  GET_PROJECT_QUERY,
  LIST_PROJECT_FILES_QUERY,
} from "@/gql/queries";

export class ProjectManager {
  static async createProject({
    sessionId,
    projectName,
    members,
  }: {
    sessionId: string;
    projectName: string;
    members: string[];
  }) {
    const res = await getApolloClient().mutate({
      mutation: CREATE_PROJECT_MUTATION,
      variables: {
        sessionId,
        name: projectName,
        members,
      },
    });

    return res.data?.createProject ?? null;
  }

  static async updateProject({
    sessionId,
    projectName,
  }: {
    sessionId: string;
    projectName: string;
  }) {
    const res = await getApolloClient().mutate({
      mutation: UPDATE_PROJECT_MUTATION,
      variables: {
        sessionId,
        name: projectName,
      },
    });

    return res.data?.updateProject ?? false;
  }

  static async addUserToProject({
    projectId,
    user,
  }: {
    projectId: number;
    user: string;
  }) {
    const res = await getApolloClient().mutate({
      mutation: ADD_PROJECT_MEMBER_MUTATION,
      variables: {
        projectId,
        user,
      },
    });

    return res.data?.addProjectMember ?? false;
  }

  static async removeUserFromProject({
    projectId,
    user,
  }: {
    projectId: number;
    user: string;
  }) {
    const res = await getApolloClient().mutate({
      mutation: REMOVE_PROJECT_MEMBER_MUTATION,
      variables: {
        projectId,
        user,
      },
    });

    return res.data?.removeProjectMember ?? false;
  }

  static async getProjectInfo({ sessionId }: { sessionId: string }) {
    const res = await getApolloClient().query({
      query: GET_PROJECT_QUERY,
      variables: {
        sessionId,
      },
    });

    if (res.errors) {
      throw new Error("Failed to fetch project info");
    }

    return res.data?.getProjectBySessionId ?? null;
  }

  static async listFiles({ projectId }: { projectId: number }) {
    const res = await getApolloClient().query({
      query: LIST_PROJECT_FILES_QUERY,
      variables: {
        projectId,
      },
    });

    if (res.errors) {
      throw new Error("Failed to fetch project files");
    }

    return res.data?.listFiles ?? [];
  }

  static async getContributions({ projectId }: { projectId: number }) {
    const res = await getApolloClient().query({
      query: GET_PROJECT_CONTRIBUTIONS,
      variables: {
        projectId,
      },
    });

    if (res.errors) {
      throw new Error("Failed to get contributions");
    }

    return res.data?.getProject?.contributions;
  }
}
