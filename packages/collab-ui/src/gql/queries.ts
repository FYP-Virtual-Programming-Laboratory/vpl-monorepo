import { gql } from "@/__generated__";

export const GET_PROJECT_WITH_UPDATES = gql(`
  query GetProjectWithUpdates($sessionId: String!) {
    project: getProjectBySessionId(sessionId: $sessionId) {
      id
      sessionId
      name
      createdAt
      yDocUpdates
    }
  }
`);

export const GET_PROJECT_QUERY = gql(`
query GetProjectBySessionId($sessionId: String!) {
  getProjectBySessionId(sessionId: $sessionId) {
    id
    sessionId
    name
    members
    createdAt
  }
}`);

export const LIST_PROJECT_FILES_QUERY = gql(`
query ListProjectFiles($projectId: Int!) {
  listFiles(projectId: $projectId) {
    ... on File {
      id
      path
      size
      createdAt
      lastModified
    }
  }
}`);

export const LIST_FILES = gql(`
query ListFiles($projectId: Int!) {
  listFiles(projectId: $projectId) {
    ... on File {
      id
      path
      parentId
      content
      size
      createdAt
      lastModified
      __typename
    }
    ... on Directory {
      id
      parentId
      path
      createdAt
      lastModified
      __typename
    }
  }
}`);

export const GET_FILE_CONTENT = gql(`
query GetFileContent($fileId: String!) {
  getFile(fileId: $fileId) {
    content
  }
}`);

export const GET_FILE_META = gql(`
query GetFileMeta($fileId: String!) {
  getFile(fileId: $fileId) {
    createdAt
    id
    lastModified
    path
    size
  }
}`);

export const GET_FILE_HISTORY = gql(`
query GetFileHistory($fileId: String!) {
  getFileVersions(fileId: $fileId) {
    id
    createdAt
    committedBy
    snapshot
    fileId
  }
}`);

export const GET_PROJECT_CONTRIBUTIONS = gql(`
query GetProjectContributions($projectId: Int!) {
  getProject(id: $projectId) {
    contributions {
      contributionStats {
        contributor
        contributions
      }
      contributors
    }
  }
}`);
