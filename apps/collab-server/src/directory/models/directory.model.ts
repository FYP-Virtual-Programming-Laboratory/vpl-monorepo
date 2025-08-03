import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Directory {
  @Field()
  id: string;

  @Field()
  path: string;

  @Field({ nullable: true })
  parentId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  lastModified: Date;
}
