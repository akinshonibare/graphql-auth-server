import Redis from "ioredis";

// test redis connection
describe("redis test", () => {
  it("ping", async () => {
    const redis = new Redis();

    await redis.ping();
  });
});
