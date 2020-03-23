import { createConnection } from "typeorm";

export const testConn = (drop: boolean = true) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "graphql-auth-backend-test",
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../entity/**/*.ts"]
  });
};
