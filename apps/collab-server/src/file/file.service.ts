import { Injectable } from '@nestjs/common';
import { DirectoryService } from '../directory/directory.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private dirService: DirectoryService,
  ) {}

  async getOrCreateFile(
    projectId: number,
    path: string,
    initialContent: string | null,
  ) {
    const existingFile = await this.prisma.file.findUnique({
      where: {
        path,
        projectId,
      },
    });

    if (existingFile) {
      return existingFile;
    }

    const splitPath = path.split('/');
    let parentId: string | null = null;

    if (splitPath.length > 1) {
      // Create parent directory if it doesn't exist
      const parentPath = splitPath.slice(0, -1).join('/');
      const parentDirectory = await this.dirService.getOrCreateDirectory(
        projectId,
        parentPath,
      );
      parentId = parentDirectory.id;
    }

    return await this.prisma.file.create({
      data: {
        path,
        content: initialContent ?? '',
        project: {
          connect: {
            id: projectId,
          },
        },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });
  }

  async renameFile({ fileId, newName }: { fileId: string; newName: string }) {
    const file = await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) return null;

    const splitPath = file.path.split('/');
    splitPath[splitPath.length - 1] = newName;

    return await this.prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        path: splitPath.join('/'),
      },
    });
  }

  async updateFile({
    fileId,
    newContent,
    snapshot,
    user,
  }: {
    fileId: string;
    newContent: string;
    snapshot: string;
    user: string;
  }) {
    await this.prisma.version.create({
      data: {
        snapshot,
        committedBy: user,
        file: {
          connect: {
            id: fileId,
          },
        },
      },
    });

    return await this.prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        content: newContent,
      },
    });
  }

  async listFiles(projectId: number) {
    const files = await this.prisma.file.findMany({
      where: {
        projectId,
      },
    });

    return files;
  }

  async getFileHistory(fileId: string) {
    const versions = await this.prisma.version.findMany({
      where: {
        fileId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return versions;
  }

  async getFile(fileId: string) {
    try {
      const file = await this.prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });

      return file;
    } catch (error) {
      void error;
      return null;
    }
  }

  async deleteFile(fileId: string) {
    await this.prisma.version.deleteMany({
      where: {
        fileId: fileId,
      },
    });

    return await this.prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  }
}
