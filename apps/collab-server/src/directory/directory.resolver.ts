import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ProjectResolver } from '../project/project.resolver';
import { DirectoryService } from './directory.service';
import { CreateDirectoryArgs } from './dto/create-directory.args';
import { RenameDirectoryArgs } from './dto/rename-directory.args';
import { Directory } from './models/directory.model';

@Resolver()
export class DirectoryResolver {
  constructor(
    private dirService: DirectoryService,
    private projectResolver: ProjectResolver,
  ) {}

  @Mutation(() => Directory)
  async getOrCreateDirectory(
    @Args() { projectId, path }: CreateDirectoryArgs,
    @Context('user') user: string,
  ) {
    await this.projectResolver.assertAccess(user, projectId);
    return this.dirService.getOrCreateDirectory(projectId, path);
  }

  @Mutation(() => Directory)
  async deleteDirectory(@Args('id') id: string) {
    return await this.dirService.deleteDirectory(id);
  }

  @Mutation(() => Directory)
  async renameDirectory(@Args() { id, newName }: RenameDirectoryArgs) {
    return await this.dirService.renameDirectory(id, newName);
  }
}
