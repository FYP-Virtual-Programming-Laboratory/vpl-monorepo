import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Contributions } from './contributions';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  sessionId: string;

  @Field()
  name: string;

  @Field()
  yDocUpdates: string;

  @Field(() => Date)
  createdAt: Date;

  @Field()
  createdBy: string;

  @Field(() => [String])
  members: string[];

  @Field(() => Contributions)
  contributions: Contributions;
}
