import "dotenv/config"
import express from "express"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import urlRouter from "./routes/url.routes.js"
import { authenticationMiddleware } from "./middlewares/auth.middleware.js"

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(cors({
    origin: process.env.FRONTEND_URL ?? "*",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticationMiddleware);

app.use('/user', userRouter);
app.use(urlRouter);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
