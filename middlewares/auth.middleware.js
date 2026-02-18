import { validateUserToken } from "../utils/token.js"

export const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) return next();

    if(!authHeader.startsWith('Bearer')) {
        return res.status(400).json({ error: "the authorization header must start with bearer"});
    }

    const [_, token] = authHeader.split(" ");

    const payload = validateUserToken(token);

    req.user = payload;
    next();
}

export const ensureAuthenticated = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "you must be authenticated to access this resource" });
  }
  next();
}