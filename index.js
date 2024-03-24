
import express from "express";
import db from "./db/connection.js";

const app = express();
const router = express.Router();
const port = 4000 || process.env.SERVICE_PORT;


app.use(express.json());
app.use("/", router);

app.listen(port, () => {
	console.log(`Service radi na portu ${port}`);
});
