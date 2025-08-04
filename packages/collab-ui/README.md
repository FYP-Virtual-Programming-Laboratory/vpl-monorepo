# Code Collab

## Overview

This project provides a collaborative real-time editor using CRDTs (Conflict-free Replicated Data Types). It includes functionalities for managing projects and files, and integrates with Apollo Client for GraphQL operations.

## Installation

To install the library, run:

```bash
# pnpm
pnpm add code-collab
# yarn
yarn add code-collab
# npm
npm i code-collab
```

## Concepts

### Virtual Programming Laboratory Session

A virtual programming laboratory session is an online environment where students or developers can write, run, and test code. It often includes tools like code editors, compilers, debuggers, and version control systems. These sessions provide a hands-on learning experience, allowing participants to apply theoretical knowledge in a practical setting. They can work on projects, complete exercises, and collaborate with others in real-time.

### Project

A project is a collection of files and resources that work together to achieve a specific goal or solve a particular problem. It typically includes source code, configuration files, documentation, and dependencies. In a virtual programming laboratory session, a project serves as the main unit of work where students or developers can practice coding, experiment with new technologies, and build applications. A project is uniquely associated with a session.

## Usage

### Configuration

You can configure the URLs for GraphQL, WebSocket, and signaling server using the `configure` function. This is best placed in the entrypoint of your code. It has to be called before any other part of this library is used.

```typescript
import { configure } from "code-collab";

await configure({
  gqlUrl: "http://your-graphql-url", // defaults to http://localhost:3000
  wsUrl: "ws://your-websocket-url", // defaults to ws://localhost:1234
  signalUrl: "ws://your-signal-url", // defaults to ws://localhost:4444
  user: "joshuaola", // required
});
```

### FileManager

The `FileManager` class provides methods to interact with files.

#### Get File Metadata

```typescript
import { FileManager } from "code-collab";

const fileMeta: {
  __typename?: "File";
  createdAt: any;
  id: string;
  lastModified: any;
  path: string;
  size?: number | null;
} | null = await FileManager.getFileMeta({ fileId: 1 });
```

#### Get File Content

```typescript
const fileContent: string | null = await FileManager.getFileContent({
  fileId: 1,
});
```

#### Get File History

```typescript
const fileHistory: {
  __typename?: "Version";
  id: number;
  createdAt: any;
  committedBy: string;
  snapshot: string;
  fileId: string;
}[] = await FileManager.getFileHistory({ fileId: 1 });
```

### ProjectManager

The `ProjectManager` class provides methods to manage projects.

#### Create Project

```typescript
import { ProjectManager } from "code-collab";

const project: {
  __typename?: "Project";
  id: number;
  name: string;
  sessionId: string;
  createdAt: any;
} | null = await ProjectManager.createProject({
  sessionId: "session-id",
  projectName: "New Project",
  members: ["johndoe", "janedoe"],
});
```

#### Update Project

```typescript
const updated: boolean = await ProjectManager.updateProject({
  sessionId: "session-id",
  projectName: "Updated Project Name",
});
```

#### Add User to Project

```typescript
const added: boolean = await ProjectManager.addUserToProject({
  projectId: 1,
  user: "farayolaj",
});
```

#### Remove User from Project

```typescript
const removed: boolean = await ProjectManager.removeUserFromProject({
  projectId: 1,
  user: "farayolaj",
});
```

#### Get Project Info

```typescript
const projectInfo: {
  __typename?: "Project";
  id: number;
  sessionId: string;
  name: string;
  members: Array<string>;
  createdAt: any;
} | null = await ProjectManager.getProjectInfo({
  sessionId: "session-id",
});
```

#### List Project Files

```typescript
const files: (
  | {
      __typename?: "Directory";
    }
  | {
      __typename?: "File";
      id: string;
      path: string;
      size?: number | null;
      createdAt: any;
      lastModified: any;
    }
)[] = await ProjectManager.listFiles({ projectId: 1 });
```

#### Get Project Contributions

```typescript
const contributions:
  | {
      __typename?: "Contributions";
      contributors: Array<string>;
      contributionStats: Array<{
        __typename?: "ContributionStats";
        contributor: string;
        contributions: number;
      }>;
    }
  | undefined = await ProjectManager.getContributions({ projectId: 1 });
```

### CodeCollab Component

The `CodeCollab` component sets up the collaborative editor.

#### Example

```tsx
import { CodeCollab } from "code-collab";

function App() {
  return (
    <CodeCollab
      sessionId="123456" // required
      getDisplayName={(user: string) => {
        return "Display Name";
      }} // required
    />
  );
}
```

## License

This project is licensed under the MIT License.
