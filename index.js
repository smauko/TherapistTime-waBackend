import express from "express";
import db from "./db/connection.js";
import dotenv from 'dotenv';
import cors from 'cors';
import auth from "./handlers/auth.js";
import termin from "./handlers/termin.js"
import uloga from "./handlers/uloga.js";
dotenv.config();

const app = express();
const router = express.Router();
const port = process.env.SERVICE_PORT || 3000; // Corrected the port assignment

// Enable CORS middleware before defining routes
app.use(cors());
app.use(express.json());
app.use("/", router);

router.route('/verify').post((req,res)=>{
    // console.log(req.body); // Log the query parameters
    let token = req.body.token; 
    // console.log(token, 'iz route');
    try{
    let result = auth.verifyMyWay(token);
    res.status(200).send('Potvrđen token korisnika: ' + result);}
    catch(e){
        res.status(500).send("Token nije valjan ili je istekao!");
    }
})

router.route('/signup').post(async (req, res) => {
    let user = req.body;
    let email = req.body.email;
    try{
    let result = await auth.registerUser(user);
    res.status(201).send("Korisnik uspješno kreiran sa mailom: " + email + ",id:(" + result +")");}
    catch(e){
        res.status(500).send("Korisnik već postoji ili je greška sa podacima!");
    }
});

router.route('/login').post(async (req, res) => {
    let user = req.body;
    let email = user.email;
    let password = user.password;
    console.log(user);
    try {
        console.log("u try sam")
        let result = await auth.logInUser(email, password);
        res.status(201).send(result);
    } catch (e) {
        console.log("catch")
        res.status(501).json({
            error: e.message,
        });
    
    }
});

router.route('/zakazitermin').post(async (req, res) => {
    let terminData = req.body;
    let datum = req.body.datum_termina;
    let vrijeme = req.body.vrijeme_termina;
    try{
    let result = await termin.dodajTermin(terminData);
    res.status(201).send("Termin uspješno kreiran na datum: " + datum + ",i u "+ vrijeme + " sati" + ", sa id:(" + result +")");}
    catch(e){
        res.status(500).send("Termin već postoji ili je greška sa podacima!");
    }
});
router.route('/zakazanitermin/doktori').get(async (req, res) => {
    try{
    let result = await uloga.sviDoktori();
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});
router.route('/zakazanitermin/dostupnitermini').get(async (req, res) => {
    const param1 = req.query.param1;
    const param2 = req.query.param2;
    //console.log(param1,param2);
    try{
    let result = await termin.dostupniTermini(param1, param2);
    console.log(result);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }
});


app.listen(port, () => {
    console.log(`Service radi na portu ${port}`);
});
