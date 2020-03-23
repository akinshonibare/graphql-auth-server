import { createWriteStream } from "fs";
import { Upload } from "../../types/Upload";
import { GraphQLUpload } from "graphql-upload";
import { Resolver, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types/MyContext";
import { User } from "../../entity/User";
import { Resume } from "../../entity/Resume";

@Resolver()
export class UploadFileResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async uploadFile(
    @Arg("file", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Ctx() context: MyContext
  ): Promise<boolean> {

    // stream file into server
    await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(
            __dirname + `/../../../files/${Date.now()}-${filename}`
          )
        )
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );

    // save file url
    try {
      const user = await User.findOne(context.payload!.userId);
      console.log(user);

      // TODO: check file type

      const new_file = await Resume.create({
        filename: `${Date.now()}-${filename}`,
        url: `http://localhost:${
          process.env.PORT
        }/files/${Date.now()}-${filename}`
      }).save();

      user!.resume = new_file;
      await user!.save()

      return true;
    } catch {
      return false;
    }
  }
}
