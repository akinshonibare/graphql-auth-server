import { v4 } from "uuid";
import { redis } from "../../redis";
import { confirmUserPrefix, forgotPasswordPrefix } from "../constants/redisPrefixes";

// create unique url for registration confirmation
export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24); //1 day expiration

  return `http://localhost:${process.env.CLIENT_PORT}/user/confirm/${token}`;
};

// create unique url to reset forgotten password
export const createForgotPasswordUrl = async (userId: number) => {
  const token = v4();
  await redis.set(forgotPasswordPrefix + token, userId, "ex", 60 * 60 * 24); //1 day expiration

  return `http://localhost:${process.env.CLIENT_PORT}/user/change-password/${token}`;
};
