import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { AppService } from './app.service';
import { DirectoryModule } from './directory/directory.module';
import { FileModule } from './file/file.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }: { req: Request }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (req.body.query.includes('IntrospectionQuery')) {
          return {};
        }

        const user = req.headers.user as string;

        if (!user) {
          throw new GraphQLError('No user specified', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: {
                statusCode: 401,
              },
            },
          });
        }

        return { user };
      },
    }),
    FileModule,
    PrismaModule,
    ProjectModule,
    DirectoryModule,
  ],
  providers: [AppService],
})
export class AppModule {}
