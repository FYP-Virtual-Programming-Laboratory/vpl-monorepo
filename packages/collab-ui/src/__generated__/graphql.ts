/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type ContributionStats = {
  __typename?: 'ContributionStats';
  contributions: Scalars['Int']['output'];
  contributor: Scalars['String']['output'];
};

export type Contributions = {
  __typename?: 'Contributions';
  contributionStats: Array<ContributionStats>;
  contributors: Array<Scalars['String']['output']>;
};

export type Directory = {
  __typename?: 'Directory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lastModified: Scalars['DateTime']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
};

export type File = {
  __typename?: 'File';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lastModified: Scalars['DateTime']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  /** File size in bytes */
  size?: Maybe<Scalars['Int']['output']>;
};

/** A union of File and Directory types. */
export type FileSystemEntry = Directory | File;

export type Mutation = {
  __typename?: 'Mutation';
  addProjectMember: Scalars['Boolean']['output'];
  /** Create a new project. */
  createProject: Project;
  deleteDirectory: Directory;
  /** Delete a file by its id. */
  deleteFile: File;
  getOrCreateDirectory: Directory;
  /** Create a new file. Returns the new file */
  newFile: File;
  removeProjectMember: Scalars['Boolean']['output'];
  renameDirectory: Directory;
  /** Update a file's name. Returns the file. */
  renameFile: File;
  /** Update a file's content and create a version for the file. Returns the file. */
  updateFile: File;
  updateProject: Scalars['Boolean']['output'];
  updateProjectDoc: Scalars['Boolean']['output'];
};


export type MutationAddProjectMemberArgs = {
  projectId: Scalars['Int']['input'];
  user: Scalars['String']['input'];
};


export type MutationCreateProjectArgs = {
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
};


export type MutationDeleteDirectoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFileArgs = {
  fileId: Scalars['String']['input'];
};


export type MutationGetOrCreateDirectoryArgs = {
  path: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
};


export type MutationNewFileArgs = {
  filePath: Scalars['String']['input'];
  initialContent?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['Int']['input'];
};


export type MutationRemoveProjectMemberArgs = {
  projectId: Scalars['Int']['input'];
  user: Scalars['String']['input'];
};


export type MutationRenameDirectoryArgs = {
  id: Scalars['String']['input'];
  newName: Scalars['String']['input'];
};


export type MutationRenameFileArgs = {
  fileId: Scalars['String']['input'];
  newName: Scalars['String']['input'];
};


export type MutationUpdateFileArgs = {
  fileId: Scalars['String']['input'];
  newContent: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
  snapshot: Scalars['String']['input'];
  yDocUpdates: Scalars['String']['input'];
};


export type MutationUpdateProjectArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  sessionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateProjectDocArgs = {
  doc: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
};

export type Project = {
  __typename?: 'Project';
  contributions: Contributions;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  yDocUpdates: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a file by its id. */
  getFile?: Maybe<File>;
  /** Get all versions of a file by file `id`. Returns an empty array if file with the id does not exist. */
  getFileVersions: Array<Version>;
  /** Find a project by its `id`. If `null` is returned, then the project could not be found. */
  getProject?: Maybe<Project>;
  /** Find a project by its `sessionId`. If `null` is returned, then the project could not be found. */
  getProjectBySessionId?: Maybe<Project>;
  /** List all files and directories in a project. Returns an empty array if no files or directories are found or if project does not exist. */
  listFiles: Array<FileSystemEntry>;
};


export type QueryGetFileArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryGetFileVersionsArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryGetProjectArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetProjectBySessionIdArgs = {
  sessionId: Scalars['String']['input'];
};


export type QueryListFilesArgs = {
  projectId: Scalars['Int']['input'];
};

export type Version = {
  __typename?: 'Version';
  committedBy: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fileId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  snapshot: Scalars['String']['output'];
};

export type UpdateFileMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
  newContent: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
  yDocUpdates: Scalars['String']['input'];
  snapshot: Scalars['String']['input'];
}>;


export type UpdateFileMutation = { __typename?: 'Mutation', updateFile: { __typename?: 'File', id: string, size?: number | null, content: string, lastModified: any } };

export type CreateProjectMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  members?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', id: number, name: string, sessionId: string, createdAt: any } };

export type UpdateProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  updateProjectId?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: boolean };

export type AddProjectMemberMutationVariables = Exact<{
  projectId: Scalars['Int']['input'];
  user: Scalars['String']['input'];
}>;


export type AddProjectMemberMutation = { __typename?: 'Mutation', addProjectMember: boolean };

export type RemoveProjectMemberMutationVariables = Exact<{
  projectId: Scalars['Int']['input'];
  user: Scalars['String']['input'];
}>;


export type RemoveProjectMemberMutation = { __typename?: 'Mutation', removeProjectMember: boolean };

export type NewFileMutationVariables = Exact<{
  projectId: Scalars['Int']['input'];
  filePath: Scalars['String']['input'];
}>;


export type NewFileMutation = { __typename?: 'Mutation', newFile: { __typename?: 'File', content: string, path: string, id: string, size?: number | null, createdAt: any } };

export type UpdateProjectDocMutationVariables = Exact<{
  projectId: Scalars['Int']['input'];
  doc: Scalars['String']['input'];
}>;


export type UpdateProjectDocMutation = { __typename?: 'Mutation', updateProjectDoc: boolean };

export type DeleteFileMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: { __typename?: 'File', id: string, path: string } };

export type RenameFileMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
  newName: Scalars['String']['input'];
}>;


export type RenameFileMutation = { __typename?: 'Mutation', renameFile: { __typename?: 'File', id: string, path: string } };

export type GetOrCreateDirectoryMutationVariables = Exact<{
  projectId: Scalars['Int']['input'];
  path: Scalars['String']['input'];
}>;


export type GetOrCreateDirectoryMutation = { __typename?: 'Mutation', getOrCreateDirectory: { __typename?: 'Directory', id: string, parentId?: string | null, path: string } };

export type RenameDirectoryMutationVariables = Exact<{
  renameDirectoryId: Scalars['String']['input'];
  newName: Scalars['String']['input'];
}>;


export type RenameDirectoryMutation = { __typename?: 'Mutation', renameDirectory: { __typename?: 'Directory', id: string, path: string } };

export type DeleteDirectoryMutationVariables = Exact<{
  deleteDirectoryId: Scalars['String']['input'];
}>;


export type DeleteDirectoryMutation = { __typename?: 'Mutation', deleteDirectory: { __typename?: 'Directory', id: string, path: string } };

export type GetProjectWithUpdatesQueryVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type GetProjectWithUpdatesQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: number, sessionId: string, name: string, createdAt: any, yDocUpdates: string } | null };

export type GetProjectBySessionIdQueryVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type GetProjectBySessionIdQuery = { __typename?: 'Query', getProjectBySessionId?: { __typename?: 'Project', id: number, sessionId: string, name: string, members: Array<string>, createdAt: any } | null };

export type ListProjectFilesQueryVariables = Exact<{
  projectId: Scalars['Int']['input'];
}>;


export type ListProjectFilesQuery = { __typename?: 'Query', listFiles: Array<{ __typename?: 'Directory' } | { __typename?: 'File', id: string, path: string, size?: number | null, createdAt: any, lastModified: any }> };

export type ListFilesQueryVariables = Exact<{
  projectId: Scalars['Int']['input'];
}>;


export type ListFilesQuery = { __typename?: 'Query', listFiles: Array<{ __typename: 'Directory', id: string, parentId?: string | null, path: string, createdAt: any, lastModified: any } | { __typename: 'File', id: string, path: string, parentId?: string | null, content: string, size?: number | null, createdAt: any, lastModified: any }> };

export type GetFileContentQueryVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type GetFileContentQuery = { __typename?: 'Query', getFile?: { __typename?: 'File', content: string } | null };

export type GetFileMetaQueryVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type GetFileMetaQuery = { __typename?: 'Query', getFile?: { __typename?: 'File', createdAt: any, id: string, lastModified: any, path: string, size?: number | null } | null };

export type GetFileHistoryQueryVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type GetFileHistoryQuery = { __typename?: 'Query', getFileVersions: Array<{ __typename?: 'Version', id: number, createdAt: any, committedBy: string, snapshot: string, fileId: string }> };

export type GetProjectContributionsQueryVariables = Exact<{
  projectId: Scalars['Int']['input'];
}>;


export type GetProjectContributionsQuery = { __typename?: 'Query', getProject?: { __typename?: 'Project', contributions: { __typename?: 'Contributions', contributors: Array<string>, contributionStats: Array<{ __typename?: 'ContributionStats', contributor: string, contributions: number }> } } | null };


export const UpdateFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newContent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yDocUpdates"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"snapshot"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newContent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newContent"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"yDocUpdates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yDocUpdates"}}},{"kind":"Argument","name":{"kind":"Name","value":"snapshot"},"value":{"kind":"Variable","name":{"kind":"Name","value":"snapshot"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}}]}}]}}]} as unknown as DocumentNode<UpdateFileMutation, UpdateFileMutationVariables>;
export const CreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"members"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"members"},"value":{"kind":"Variable","name":{"kind":"Name","value":"members"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateProjectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateProjectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}]}]}}]} as unknown as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const AddProjectMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddProjectMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addProjectMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}]}}]} as unknown as DocumentNode<AddProjectMemberMutation, AddProjectMemberMutationVariables>;
export const RemoveProjectMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProjectMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProjectMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}]}}]} as unknown as DocumentNode<RemoveProjectMemberMutation, RemoveProjectMemberMutationVariables>;
export const NewFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filePath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filePath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filePath"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<NewFileMutation, NewFileMutationVariables>;
export const UpdateProjectDocDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProjectDoc"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doc"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProjectDoc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"doc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doc"}}}]}]}}]} as unknown as DocumentNode<UpdateProjectDocMutation, UpdateProjectDocMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const RenameFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<RenameFileMutation, RenameFileMutationVariables>;
export const GetOrCreateDirectoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetOrCreateDirectory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrCreateDirectory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<GetOrCreateDirectoryMutation, GetOrCreateDirectoryMutationVariables>;
export const RenameDirectoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameDirectory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"renameDirectoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameDirectory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"renameDirectoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<RenameDirectoryMutation, RenameDirectoryMutationVariables>;
export const DeleteDirectoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDirectory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteDirectoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDirectory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteDirectoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<DeleteDirectoryMutation, DeleteDirectoryMutationVariables>;
export const GetProjectWithUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectWithUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"project"},"name":{"kind":"Name","value":"getProjectBySessionId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"yDocUpdates"}}]}}]}}]} as unknown as DocumentNode<GetProjectWithUpdatesQuery, GetProjectWithUpdatesQueryVariables>;
export const GetProjectBySessionIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectBySessionId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectBySessionId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetProjectBySessionIdQuery, GetProjectBySessionIdQueryVariables>;
export const ListProjectFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListProjectFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}}]}}]}}]}}]} as unknown as DocumentNode<ListProjectFilesQuery, ListProjectFilesQueryVariables>;
export const ListFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Directory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode<ListFilesQuery, ListFilesQueryVariables>;
export const GetFileContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<GetFileContentQuery, GetFileContentQueryVariables>;
export const GetFileMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]} as unknown as DocumentNode<GetFileMetaQuery, GetFileMetaQueryVariables>;
export const GetFileHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFileVersions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"committedBy"}},{"kind":"Field","name":{"kind":"Name","value":"snapshot"}},{"kind":"Field","name":{"kind":"Name","value":"fileId"}}]}}]}}]} as unknown as DocumentNode<GetFileHistoryQuery, GetFileHistoryQueryVariables>;
export const GetProjectContributionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectContributions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contributions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contributionStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contributor"}},{"kind":"Field","name":{"kind":"Name","value":"contributions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contributors"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectContributionsQuery, GetProjectContributionsQueryVariables>;