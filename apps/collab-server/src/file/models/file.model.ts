import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field()
  id: string;

  @Field()
  path: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  parentId: string;

  @Field(() => Int, {
    description: 'File size in bytes',
    nullable: true,
  })
  size: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  lastModified: Date;
}
