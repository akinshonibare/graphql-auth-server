import { InputType, Field } from "type-graphql";
import { Length, IsEmail, MinLength } from "class-validator";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 128)
  firstName: string;

  @Field()
  @Length(1, 128)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "account with email already exists"})
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}
