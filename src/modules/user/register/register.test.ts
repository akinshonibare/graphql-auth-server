import { testConn } from "../../../test-utils/testConn";
import { Connection } from "typeorm";
import { graphqlCall } from "../../../test-utils/graphqlCall";
import { redis } from "../../../redis";
import faker from "faker";
import { User } from "../../../entity/User";

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
  if (redis.status == "end") {
    await redis.connect();
  }
});
afterAll(async () => {
  await conn.close();
  redis.disconnect();
});

const registerMutation = `
  mutation Register($data: RegisterInput!) {
    register(
      data: $data
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;
describe("register", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName().toLowerCase(),
      lastName: faker.name.lastName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password()
    };

    const response = await graphqlCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.emailConfirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(user.firstName);
  });
});
