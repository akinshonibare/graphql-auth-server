import { Resolver, Mutation, Arg, Int } from "type-graphql";
import { User } from "../../entity/User";

import { getConnection } from "typeorm";

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }
}
