/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\nmutation UpdateFile($fileId: String!, $newContent: String!, $projectId: Int!, $yDocUpdates: String!, $snapshot: String!) {\n  updateFile(fileId: $fileId, newContent: $newContent, projectId: $projectId, yDocUpdates: $yDocUpdates, snapshot: $snapshot) {\n    id\n    size\n    content\n    lastModified\n  }\n}": typeof types.UpdateFileDocument,
    "\nmutation CreateProject($sessionId: String!, $name: String!, $members: [String!]) {\n  createProject(sessionId: $sessionId, name: $name, members: $members) {\n    id\n    name\n    sessionId\n    createdAt\n  }\n}": typeof types.CreateProjectDocument,
    "\nmutation UpdateProject($name: String!, $updateProjectId: Int, $sessionId: String) {\n  updateProject(name: $name, id: $updateProjectId, sessionId: $sessionId)\n}": typeof types.UpdateProjectDocument,
    "\nmutation AddProjectMember($projectId: Int!, $user: String!) {\n  addProjectMember(projectId: $projectId, user: $user)\n}": typeof types.AddProjectMemberDocument,
    "\nmutation RemoveProjectMember($projectId: Int!, $user: String!) {\n  removeProjectMember(projectId: $projectId, user: $user)\n}": typeof types.RemoveProjectMemberDocument,
    "\nmutation NewFile($projectId: Int!, $filePath: String!) {\n  newFile(projectId: $projectId, filePath: $filePath) {\n    content\n    path\n    id\n    size\n    createdAt\n  }\n}": typeof types.NewFileDocument,
    "\nmutation UpdateProjectDoc($projectId: Int!, $doc: String!) {\n  updateProjectDoc(projectId: $projectId, doc: $doc)\n}": typeof types.UpdateProjectDocDocument,
    "\nmutation DeleteFile($fileId: String!) {\n  deleteFile(fileId: $fileId) {\n    id\n    path\n  }\n}": typeof types.DeleteFileDocument,
    "\nmutation RenameFile($fileId: String!, $newName: String!) {\n  renameFile(fileId: $fileId, newName: $newName) {\n    id\n    path\n  }\n}": typeof types.RenameFileDocument,
    "\nmutation GetOrCreateDirectory($projectId: Int!, $path: String!) {\n  getOrCreateDirectory(projectId: $projectId, path: $path) {\n    id\n    parentId\n    path\n  }\n}": typeof types.GetOrCreateDirectoryDocument,
    "\nmutation RenameDirectory($renameDirectoryId: String!, $newName: String!) {\n  renameDirectory(id: $renameDirectoryId, newName: $newName) {\n    id\n    path\n  }\n}": typeof types.RenameDirectoryDocument,
    "\nmutation DeleteDirectory($deleteDirectoryId: String!) {\n  deleteDirectory(id: $deleteDirectoryId) {\n    id\n    path\n  }\n}": typeof types.DeleteDirectoryDocument,
    "\n  query GetProjectWithUpdates($sessionId: String!) {\n    project: getProjectBySessionId(sessionId: $sessionId) {\n      id\n      sessionId\n      name\n      createdAt\n      yDocUpdates\n    }\n  }\n": typeof types.GetProjectWithUpdatesDocument,
    "\nquery GetProjectBySessionId($sessionId: String!) {\n  getProjectBySessionId(sessionId: $sessionId) {\n    id\n    sessionId\n    name\n    members\n    createdAt\n  }\n}": typeof types.GetProjectBySessionIdDocument,
    "\nquery ListProjectFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      size\n      createdAt\n      lastModified\n    }\n  }\n}": typeof types.ListProjectFilesDocument,
    "\nquery ListFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      parentId\n      content\n      size\n      createdAt\n      lastModified\n      __typename\n    }\n    ... on Directory {\n      id\n      parentId\n      path\n      createdAt\n      lastModified\n      __typename\n    }\n  }\n}": typeof types.ListFilesDocument,
    "\nquery GetFileContent($fileId: String!) {\n  getFile(fileId: $fileId) {\n    content\n  }\n}": typeof types.GetFileContentDocument,
    "\nquery GetFileMeta($fileId: String!) {\n  getFile(fileId: $fileId) {\n    createdAt\n    id\n    lastModified\n    path\n    size\n  }\n}": typeof types.GetFileMetaDocument,
    "\nquery GetFileHistory($fileId: String!) {\n  getFileVersions(fileId: $fileId) {\n    id\n    createdAt\n    committedBy\n    snapshot\n    fileId\n  }\n}": typeof types.GetFileHistoryDocument,
    "\nquery GetProjectContributions($projectId: Int!) {\n  getProject(id: $projectId) {\n    contributions {\n      contributionStats {\n        contributor\n        contributions\n      }\n      contributors\n    }\n  }\n}": typeof types.GetProjectContributionsDocument,
};
const documents: Documents = {
    "\nmutation UpdateFile($fileId: String!, $newContent: String!, $projectId: Int!, $yDocUpdates: String!, $snapshot: String!) {\n  updateFile(fileId: $fileId, newContent: $newContent, projectId: $projectId, yDocUpdates: $yDocUpdates, snapshot: $snapshot) {\n    id\n    size\n    content\n    lastModified\n  }\n}": types.UpdateFileDocument,
    "\nmutation CreateProject($sessionId: String!, $name: String!, $members: [String!]) {\n  createProject(sessionId: $sessionId, name: $name, members: $members) {\n    id\n    name\n    sessionId\n    createdAt\n  }\n}": types.CreateProjectDocument,
    "\nmutation UpdateProject($name: String!, $updateProjectId: Int, $sessionId: String) {\n  updateProject(name: $name, id: $updateProjectId, sessionId: $sessionId)\n}": types.UpdateProjectDocument,
    "\nmutation AddProjectMember($projectId: Int!, $user: String!) {\n  addProjectMember(projectId: $projectId, user: $user)\n}": types.AddProjectMemberDocument,
    "\nmutation RemoveProjectMember($projectId: Int!, $user: String!) {\n  removeProjectMember(projectId: $projectId, user: $user)\n}": types.RemoveProjectMemberDocument,
    "\nmutation NewFile($projectId: Int!, $filePath: String!) {\n  newFile(projectId: $projectId, filePath: $filePath) {\n    content\n    path\n    id\n    size\n    createdAt\n  }\n}": types.NewFileDocument,
    "\nmutation UpdateProjectDoc($projectId: Int!, $doc: String!) {\n  updateProjectDoc(projectId: $projectId, doc: $doc)\n}": types.UpdateProjectDocDocument,
    "\nmutation DeleteFile($fileId: String!) {\n  deleteFile(fileId: $fileId) {\n    id\n    path\n  }\n}": types.DeleteFileDocument,
    "\nmutation RenameFile($fileId: String!, $newName: String!) {\n  renameFile(fileId: $fileId, newName: $newName) {\n    id\n    path\n  }\n}": types.RenameFileDocument,
    "\nmutation GetOrCreateDirectory($projectId: Int!, $path: String!) {\n  getOrCreateDirectory(projectId: $projectId, path: $path) {\n    id\n    parentId\n    path\n  }\n}": types.GetOrCreateDirectoryDocument,
    "\nmutation RenameDirectory($renameDirectoryId: String!, $newName: String!) {\n  renameDirectory(id: $renameDirectoryId, newName: $newName) {\n    id\n    path\n  }\n}": types.RenameDirectoryDocument,
    "\nmutation DeleteDirectory($deleteDirectoryId: String!) {\n  deleteDirectory(id: $deleteDirectoryId) {\n    id\n    path\n  }\n}": types.DeleteDirectoryDocument,
    "\n  query GetProjectWithUpdates($sessionId: String!) {\n    project: getProjectBySessionId(sessionId: $sessionId) {\n      id\n      sessionId\n      name\n      createdAt\n      yDocUpdates\n    }\n  }\n": types.GetProjectWithUpdatesDocument,
    "\nquery GetProjectBySessionId($sessionId: String!) {\n  getProjectBySessionId(sessionId: $sessionId) {\n    id\n    sessionId\n    name\n    members\n    createdAt\n  }\n}": types.GetProjectBySessionIdDocument,
    "\nquery ListProjectFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      size\n      createdAt\n      lastModified\n    }\n  }\n}": types.ListProjectFilesDocument,
    "\nquery ListFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      parentId\n      content\n      size\n      createdAt\n      lastModified\n      __typename\n    }\n    ... on Directory {\n      id\n      parentId\n      path\n      createdAt\n      lastModified\n      __typename\n    }\n  }\n}": types.ListFilesDocument,
    "\nquery GetFileContent($fileId: String!) {\n  getFile(fileId: $fileId) {\n    content\n  }\n}": types.GetFileContentDocument,
    "\nquery GetFileMeta($fileId: String!) {\n  getFile(fileId: $fileId) {\n    createdAt\n    id\n    lastModified\n    path\n    size\n  }\n}": types.GetFileMetaDocument,
    "\nquery GetFileHistory($fileId: String!) {\n  getFileVersions(fileId: $fileId) {\n    id\n    createdAt\n    committedBy\n    snapshot\n    fileId\n  }\n}": types.GetFileHistoryDocument,
    "\nquery GetProjectContributions($projectId: Int!) {\n  getProject(id: $projectId) {\n    contributions {\n      contributionStats {\n        contributor\n        contributions\n      }\n      contributors\n    }\n  }\n}": types.GetProjectContributionsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation UpdateFile($fileId: String!, $newContent: String!, $projectId: Int!, $yDocUpdates: String!, $snapshot: String!) {\n  updateFile(fileId: $fileId, newContent: $newContent, projectId: $projectId, yDocUpdates: $yDocUpdates, snapshot: $snapshot) {\n    id\n    size\n    content\n    lastModified\n  }\n}"): (typeof documents)["\nmutation UpdateFile($fileId: String!, $newContent: String!, $projectId: Int!, $yDocUpdates: String!, $snapshot: String!) {\n  updateFile(fileId: $fileId, newContent: $newContent, projectId: $projectId, yDocUpdates: $yDocUpdates, snapshot: $snapshot) {\n    id\n    size\n    content\n    lastModified\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateProject($sessionId: String!, $name: String!, $members: [String!]) {\n  createProject(sessionId: $sessionId, name: $name, members: $members) {\n    id\n    name\n    sessionId\n    createdAt\n  }\n}"): (typeof documents)["\nmutation CreateProject($sessionId: String!, $name: String!, $members: [String!]) {\n  createProject(sessionId: $sessionId, name: $name, members: $members) {\n    id\n    name\n    sessionId\n    createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation UpdateProject($name: String!, $updateProjectId: Int, $sessionId: String) {\n  updateProject(name: $name, id: $updateProjectId, sessionId: $sessionId)\n}"): (typeof documents)["\nmutation UpdateProject($name: String!, $updateProjectId: Int, $sessionId: String) {\n  updateProject(name: $name, id: $updateProjectId, sessionId: $sessionId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddProjectMember($projectId: Int!, $user: String!) {\n  addProjectMember(projectId: $projectId, user: $user)\n}"): (typeof documents)["\nmutation AddProjectMember($projectId: Int!, $user: String!) {\n  addProjectMember(projectId: $projectId, user: $user)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RemoveProjectMember($projectId: Int!, $user: String!) {\n  removeProjectMember(projectId: $projectId, user: $user)\n}"): (typeof documents)["\nmutation RemoveProjectMember($projectId: Int!, $user: String!) {\n  removeProjectMember(projectId: $projectId, user: $user)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation NewFile($projectId: Int!, $filePath: String!) {\n  newFile(projectId: $projectId, filePath: $filePath) {\n    content\n    path\n    id\n    size\n    createdAt\n  }\n}"): (typeof documents)["\nmutation NewFile($projectId: Int!, $filePath: String!) {\n  newFile(projectId: $projectId, filePath: $filePath) {\n    content\n    path\n    id\n    size\n    createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation UpdateProjectDoc($projectId: Int!, $doc: String!) {\n  updateProjectDoc(projectId: $projectId, doc: $doc)\n}"): (typeof documents)["\nmutation UpdateProjectDoc($projectId: Int!, $doc: String!) {\n  updateProjectDoc(projectId: $projectId, doc: $doc)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation DeleteFile($fileId: String!) {\n  deleteFile(fileId: $fileId) {\n    id\n    path\n  }\n}"): (typeof documents)["\nmutation DeleteFile($fileId: String!) {\n  deleteFile(fileId: $fileId) {\n    id\n    path\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RenameFile($fileId: String!, $newName: String!) {\n  renameFile(fileId: $fileId, newName: $newName) {\n    id\n    path\n  }\n}"): (typeof documents)["\nmutation RenameFile($fileId: String!, $newName: String!) {\n  renameFile(fileId: $fileId, newName: $newName) {\n    id\n    path\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation GetOrCreateDirectory($projectId: Int!, $path: String!) {\n  getOrCreateDirectory(projectId: $projectId, path: $path) {\n    id\n    parentId\n    path\n  }\n}"): (typeof documents)["\nmutation GetOrCreateDirectory($projectId: Int!, $path: String!) {\n  getOrCreateDirectory(projectId: $projectId, path: $path) {\n    id\n    parentId\n    path\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RenameDirectory($renameDirectoryId: String!, $newName: String!) {\n  renameDirectory(id: $renameDirectoryId, newName: $newName) {\n    id\n    path\n  }\n}"): (typeof documents)["\nmutation RenameDirectory($renameDirectoryId: String!, $newName: String!) {\n  renameDirectory(id: $renameDirectoryId, newName: $newName) {\n    id\n    path\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation DeleteDirectory($deleteDirectoryId: String!) {\n  deleteDirectory(id: $deleteDirectoryId) {\n    id\n    path\n  }\n}"): (typeof documents)["\nmutation DeleteDirectory($deleteDirectoryId: String!) {\n  deleteDirectory(id: $deleteDirectoryId) {\n    id\n    path\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectWithUpdates($sessionId: String!) {\n    project: getProjectBySessionId(sessionId: $sessionId) {\n      id\n      sessionId\n      name\n      createdAt\n      yDocUpdates\n    }\n  }\n"): (typeof documents)["\n  query GetProjectWithUpdates($sessionId: String!) {\n    project: getProjectBySessionId(sessionId: $sessionId) {\n      id\n      sessionId\n      name\n      createdAt\n      yDocUpdates\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetProjectBySessionId($sessionId: String!) {\n  getProjectBySessionId(sessionId: $sessionId) {\n    id\n    sessionId\n    name\n    members\n    createdAt\n  }\n}"): (typeof documents)["\nquery GetProjectBySessionId($sessionId: String!) {\n  getProjectBySessionId(sessionId: $sessionId) {\n    id\n    sessionId\n    name\n    members\n    createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery ListProjectFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      size\n      createdAt\n      lastModified\n    }\n  }\n}"): (typeof documents)["\nquery ListProjectFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      size\n      createdAt\n      lastModified\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery ListFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      parentId\n      content\n      size\n      createdAt\n      lastModified\n      __typename\n    }\n    ... on Directory {\n      id\n      parentId\n      path\n      createdAt\n      lastModified\n      __typename\n    }\n  }\n}"): (typeof documents)["\nquery ListFiles($projectId: Int!) {\n  listFiles(projectId: $projectId) {\n    ... on File {\n      id\n      path\n      parentId\n      content\n      size\n      createdAt\n      lastModified\n      __typename\n    }\n    ... on Directory {\n      id\n      parentId\n      path\n      createdAt\n      lastModified\n      __typename\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetFileContent($fileId: String!) {\n  getFile(fileId: $fileId) {\n    content\n  }\n}"): (typeof documents)["\nquery GetFileContent($fileId: String!) {\n  getFile(fileId: $fileId) {\n    content\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetFileMeta($fileId: String!) {\n  getFile(fileId: $fileId) {\n    createdAt\n    id\n    lastModified\n    path\n    size\n  }\n}"): (typeof documents)["\nquery GetFileMeta($fileId: String!) {\n  getFile(fileId: $fileId) {\n    createdAt\n    id\n    lastModified\n    path\n    size\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetFileHistory($fileId: String!) {\n  getFileVersions(fileId: $fileId) {\n    id\n    createdAt\n    committedBy\n    snapshot\n    fileId\n  }\n}"): (typeof documents)["\nquery GetFileHistory($fileId: String!) {\n  getFileVersions(fileId: $fileId) {\n    id\n    createdAt\n    committedBy\n    snapshot\n    fileId\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetProjectContributions($projectId: Int!) {\n  getProject(id: $projectId) {\n    contributions {\n      contributionStats {\n        contributor\n        contributions\n      }\n      contributors\n    }\n  }\n}"): (typeof documents)["\nquery GetProjectContributions($projectId: Int!) {\n  getProject(id: $projectId) {\n    contributions {\n      contributionStats {\n        contributor\n        contributions\n      }\n      contributors\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;