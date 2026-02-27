import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || "username",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "dbname",
    entities: ["src/entities/*.ts"],
    synchronize: false,
    migrations: ["src/migrations/*.ts"]
});

export default AppDataSource;