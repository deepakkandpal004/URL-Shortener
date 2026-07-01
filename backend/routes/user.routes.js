import express from "express";
import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validation/request.validation.js";
import { hashPasswordwithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.services.js";
import { createUser } from "../services/user.services.js";
import { createUserToken } from "../utils/token.js"
const router = express.Router();
 
router.post("/sign-up", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res
      .status(401)
      .json({ error: `user with this email ${email} already exists` });
  }

  const { salt, password: hashedPassword } = hashPasswordwithSalt(password);

  const User = await createUser({
    firstname,
    lastname,
    email,
    hashedPassword,
    salt,
  });

  return res
    .status(201)
    .json({ message: `User Registered Successfully`, userId: User.id });
});

router.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: `No user found with email ${email}` });
  }
  const { password:hashedPassword } = hashPasswordwithSalt(password, user.salt);

  if (user.password !== hashedPassword) {
    return res.status(401).json({ error: `Incorrect password` });
  }

  const token = await createUserToken({ id: user.id })

  return res
    .status(200)
    .json({ message: "User LoggedIn Successfully", token, userId: user.id });
});

export default router;
