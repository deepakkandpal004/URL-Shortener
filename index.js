import "dotenv/config"
import express from "express"
import userRouter from "./routes/user.routes.js"
import urlRouter from "./routes/url.routes.js"
import { authenticationMiddleware } from "./middlewares/auth.middleware.js"

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware); 

app.use('/user', userRouter);
app.use(urlRouter);

app.listen(PORT, () => {
    console.log(`The server is listen on PORT: ${PORT}`)
})