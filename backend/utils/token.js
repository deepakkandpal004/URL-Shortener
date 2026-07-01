import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validation/token.validation.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const createUserToken = async (payload) => {
  const validationResult = await userTokenSchema.safeParseAsync(payload);

  if (validationResult.error) throw new Error(validationResult.error.message);

  const payloadValidatedData = validationResult.data;

  const token = jwt.sign(payloadValidatedData, JWT_SECRET);
  return token;
};

export const validateUserToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
};
