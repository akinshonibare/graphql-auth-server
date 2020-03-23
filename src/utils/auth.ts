import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import { Response } from "express";

// create jwt access token
export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m"
  });
};

// create refresh token
export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d"
    }
  );
};

// set refresh token
export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("akid", token, {
    expires: new Date(Date.now() + 1000 * 3600000), //expires in a 10000 hours
    httpOnly: true,
    path: "/refresh_token"
  });
};
