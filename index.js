import express from "express";
import db from "./db/connection.js";
import dotenv from 'dotenv';
import cors from 'cors';
import auth from "./handlers/auth.js";
dotenv.config();

const app = express();
const router = express.Router();
const port = process.env.SERVICE_PORT || 3000; // Corrected the port assignment

// Enable CORS middleware before defining routes
app.use(cors());
app.use(express.json());
app.use("/", router);



router.route('/signup').post(async (req, res) => {
    let user = req.body;
    let email = req.body.email;
    try{
    let result = await auth.registerUser(user);
    res.status(201).send("Korisnik uspješno kreiran sa mailom: " + email + "id:(" + result +")");}
    catch(e){
        res.status(500).send("Korisnik već postoji ili je greška sa podacima!");
    }
});

router.route('/login').get(async (req, res) => {
    
});

app.listen(port, () => {
    console.log(`Service radi na portu ${port}`);
});
