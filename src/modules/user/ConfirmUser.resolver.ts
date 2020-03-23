import { redis } from "../../redis";
import { User } from "../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { confirmUserPrefix } from "../constants/redisPrefixes";

@Resolver(User)
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {

    // get user id from token
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      return false;
    }

    // set email confirm field to true
    await User.update({ id: parseInt(userId) }, { emailConfirmed: true });

    // delete token
    await redis.del(confirmUserPrefix + token);

    return true;
  }
}
