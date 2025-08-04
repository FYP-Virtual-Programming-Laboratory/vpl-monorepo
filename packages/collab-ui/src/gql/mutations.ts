import { gql } from "@/__generated__";

export const UPDATE_FILE = gql(`
mutation UpdateFile($fileId: String!, $newContent: String!, $projectId: Int!, $yDocUpdates: String!, $snapshot: String!) {
  updateFile(fileId: $fileId, newContent: $newContent, projectId: $projectId, yDocUpdates: $yDocUpdates, snapshot: $snapshot) {
    id
    size
    content
    lastModified
  }
}`);

export const CREATE_PROJECT_MUTATION = gql(`
mutation CreateProject($sessionId: String!, $name: String!, $members: [String!]) {
  createProject(sessionId: $sessionId, name: $name, members: $members) {
    id
    name
    sessionId
    createdAt
  }
}`);

export const UPDATE_PROJECT_MUTATION = gql(`
mutation UpdateProject($name: String!, $updateProjectId: Int, $sessionId: String) {
  updateProject(name: $name, id: $updateProjectId, sessionId: $sessionId)
}`);

export const ADD_PROJECT_MEMBER_MUTATION = gql(`
mutation AddProjectMember($projectId: Int!, $user: String!) {
  addProjectMember(projectId: $projectId, user: $user)
}`);

export const REMOVE_PROJECT_MEMBER_MUTATION = gql(`
mutation RemoveProjectMember($projectId: Int!, $user: String!) {
  removeProjectMember(projectId: $projectId, user: $user)
}`);

export const NEW_FILE = gql(`
mutation NewFile($projectId: Int!, $filePath: String!) {
  newFile(projectId: $projectId, filePath: $filePath) {
    content
    path
    id
    size
    createdAt
  }
}`);

export const UPDATE_PROJECT_DOC = gql(`
mutation UpdateProjectDoc($projectId: Int!, $doc: String!) {
  updateProjectDoc(projectId: $projectId, doc: $doc)
}`);

export const DELETE_FILE = gql(`
mutation DeleteFile($fileId: String!) {
  deleteFile(fileId: $fileId) {
    id
    path
  }
}`);

export const RENAME_FILE = gql(`
mutation RenameFile($fileId: String!, $newName: String!) {
  renameFile(fileId: $fileId, newName: $newName) {
    id
    path
  }
}`);

export const NEW_DIRECTORY = gql(`
mutation GetOrCreateDirectory($projectId: Int!, $path: String!) {
  getOrCreateDirectory(projectId: $projectId, path: $path) {
    id
    parentId
    path
  }
}`);

export const RENAME_DIRECTORY = gql(`
mutation RenameDirectory($renameDirectoryId: String!, $newName: String!) {
  renameDirectory(id: $renameDirectoryId, newName: $newName) {
    id
    path
  }
}`);

export const DELETE_DIRECTORY = gql(`
mutation DeleteDirectory($deleteDirectoryId: String!) {
  deleteDirectory(id: $deleteDirectoryId) {
    id
    path
  }
}`);
