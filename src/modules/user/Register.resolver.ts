import { hash } from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { Resolver, Mutation, Arg } from "type-graphql";
import { sendEmail } from "../middleware/sendEmails";
import { createConfirmationUrl } from "../middleware/createUrls";

@Resolver(User)
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {

    // hash password
    const hashedPassword = await hash(password, 12);

    // create user
    const user = await User.create({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    }).save();

    // send confirmation email
    await sendEmail(email, await createConfirmationUrl(user.id));
    
    return user;
  }
}
