import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DirectoryService } from '../directory/directory.service';
import { ProjectResolver } from '../project/project.resolver';
import { ProjectService } from '../project/project.service';
import { DeleteFileArgs } from './dtos/delete-file.args';
import { NewFileArgs } from './dtos/new-file.args';
import { RenameFileArgs } from './dtos/rename-file.args';
import { UpdateFileArgs } from './dtos/update-file.args';
import { FileService } from './file.service';
import { FileSystemEntry } from './models/file-system-entry.model';
import { File } from './models/file.model';
import { Version } from './models/version.model';

@Resolver(() => File)
export class FileResolver {
  constructor(
    private filesService: FileService,
    private projectService: ProjectService,
    private dirService: DirectoryService,
    private projectResolver: ProjectResolver,
  ) {}

  @ResolveField()
  size(@Parent() file: File) {
    return Buffer.byteLength(file.content, 'utf8');
  }

  @Mutation(() => File, {
    description: 'Create a new file. Returns the new file',
  })
  async newFile(
    @Args() { filePath, projectId, initialContent }: NewFileArgs,
    @Context('user') user: string,
  ) {
    await this.projectResolver.assertAccess(user, projectId);
    return this.filesService.getOrCreateFile(
      projectId,
      filePath,
      initialContent || null,
    );
  }

  @Mutation(() => File, {
    description:
      "Update a file's content and create a version for the file. Returns the file.",
  })
  async updateFile(
    @Args()
    { fileId, newContent, projectId, yDocUpdates, snapshot }: UpdateFileArgs,
    @Context('user') user: string,
  ) {
    await this.projectResolver.assertAccess(user, projectId);
    await this.projectService.storeYDoc(projectId, yDocUpdates);
    return this.filesService.updateFile({
      fileId,
      newContent,
      user,
      snapshot,
    });
  }

  @Mutation(() => File, {
    description: "Update a file's name. Returns the file.",
  })
  async renameFile(
    @Args()
    { fileId, newName }: RenameFileArgs,
  ) {
    return this.filesService.renameFile({
      fileId,
      newName,
    });
  }

  @Query(() => [FileSystemEntry], {
    description:
      'List all files and directories in a project. Returns an empty array if no files or directories are found or if project does not exist.',
  })
  async listFiles(
    @Args('projectId', { type: () => Int }) projectId: number,
    @Context('user') user: string,
  ) {
    await this.projectResolver.assertAccess(user, projectId);
    const files = await this.filesService.listFiles(projectId);
    const directories = await this.dirService.listDirectories(projectId);
    return [...directories, ...files];
  }

  @Query(() => [Version], {
    description:
      'Get all versions of a file by file `id`. Returns an empty array if file with the id does not exist.',
  })
  async getFileVersions(@Args('fileId') fileId: string) {
    return this.filesService.getFileHistory(fileId);
  }

  @Query(() => File, {
    nullable: true,
    description: 'Get a file by its id.',
  })
  async getFile(@Args('fileId') fileId: string) {
    return this.filesService.getFile(fileId);
  }

  @Mutation(() => File, {
    description: 'Delete a file by its id.',
  })
  async deleteFile(@Args() { fileId }: DeleteFileArgs) {
    return this.filesService.deleteFile(fileId);
  }
}
