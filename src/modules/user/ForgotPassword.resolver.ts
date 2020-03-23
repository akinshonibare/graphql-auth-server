import { User } from "../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { sendEmail } from "../middleware/sendEmails";
import { createForgotPasswordUrl } from "../middleware/createUrls";

@Resolver(User)
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {

    // find user via email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      //return true regardless
      return true;
    }

    // send forgot password email with unique token
    await sendEmail(email, await createForgotPasswordUrl(user.id));

    return true
  }
}
