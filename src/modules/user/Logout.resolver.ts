import { MyContext } from "../../types/MyContext";
import { Resolver, Mutation, Ctx } from "type-graphql";
import { sendRefreshToken } from "../../utils/auth";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {

    // remove refresh token
    sendRefreshToken(res, "");
  
    return true;
  }
}
