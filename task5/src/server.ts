import "reflect-metadata"
import dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import AppDataSource from './lib/DB';
import router from "./routes";
import koaQs from 'koa-qs';


const app = new Koa();
app.use(bodyParser());
koaQs(app);

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