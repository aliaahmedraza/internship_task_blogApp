import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConfig from "./db/config.js";
import allRoutes from "./routers/allRoutes/index.js";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: "https://iternshi-frontend-cxi4wv3h6-ali-ahmed-razas-projects.vercel.app",
        credentials: true,
        methods: "GET,POST,PUT,DELETE,PATCH",
        allowedHeaders: "Content-Type,Authorization",
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(allRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

dbConfig;