import { hash } from "bcryptjs";
import { redis } from "../../redis";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { sendRefreshToken, createRefreshToken, createAccessToken } from "../../utils/auth";
import { LoginResponse } from "./login/LoginResponse";

@Resolver(User)
export class ChangePasswordResolver {
  @Mutation(() => LoginResponse, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse | null> {

    // get user id from confirmation token
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    // get user
    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    // delete confirmation token
    await redis.del(forgotPasswordPrefix + token);

    // hash new password
    user.password = await hash(password, 12);

    await user.save();

    // send new refresh token
    sendRefreshToken(res, createRefreshToken(user));
    
    return {
      accessToken: createAccessToken(user),
      user
    };
  }
}
