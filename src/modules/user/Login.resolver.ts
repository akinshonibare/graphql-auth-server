import { compare } from "bcryptjs";
import { User } from "../../entity/User";
import { LoginInput } from "./login/LoginInput";
import { MyContext } from "../../types/MyContext";
import { LoginResponse } from "./login/LoginResponse";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { sendRefreshToken } from "../../utils/auth";
import { createRefreshToken, createAccessToken } from "../../utils/auth";

@Resolver(User)
export class LoginResolver {
  @Mutation(() => LoginResponse, {nullable: true})
  async login(
    @Arg("data") { email, password }: LoginInput,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse | null> {

    // find user via email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    // check if password matches
    const valid = await compare(password, user.password);

    if (!valid) {
      return null;
    }

    // check if email is confirmed
    if (!user.emailConfirmed) {
      throw new Error("confirm email before signing in");
    }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }
}
