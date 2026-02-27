import "reflect-metadata"
import dotenv from 'dotenv';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import AppDataSource from './lib/db';
import router from "./routes";

dotenv.config();

const app = new Koa();
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

AppDataSource.initialize()
.then(() => {
    console.log("Data source initialized.")
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}/`)
    });
})
.catch((err : Error) => {
    console.log("Some error occurred while starting server.", err.message);
})