import { verify } from "jsonwebtoken";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../../types/MyContext";
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    // verify token, to find user
    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      context.payload = payload as any;

      const user = await User.findOne(payload.userId);
      return user;

    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
