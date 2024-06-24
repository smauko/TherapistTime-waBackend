import express from "express";
import db from "./db/connection.js";
import dotenv from 'dotenv';
import cors from 'cors';
import auth from "./handlers/auth.js";
import termin from "./handlers/termin.js"
import uloga from "./handlers/uloga.js";
import ocijene from "./handlers/ocijene.js";
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
    console.log(user, email);   
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
router.route('/zakazitermin/doktori').get(async (req, res) => {
    try{
    let result = await uloga.sviDoktori();
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});
router.route('/zakazitermin/dostupnitermini').get(async (req, res) => {
    const param1 = req.query.param1;
    const param2 = req.query.param2;
    console.log(param1,param2);
    try{
    let result = await termin.dostupniTermini(param1, param2);
    console.log(result);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }
});

router.route('/zakazanitermini').get(async (req, res) => {
    let param3 = req.query.param3;
    console.log(param3);
    try{
    let result = await termin.dohvatiTermine(param3);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});

router.route('/prikaztermina').get(async (req, res) => {
    let param4 = req.query.param4;
    console.log(param4);
    try{
    let result = await termin.dohvatiTermin(param4);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});

router.route('/izbrisitermin').delete(async (req, res) => {
    let param5 = req.query.param5;
    console.log("parametar",param5);
    try{
    let result = await termin.izbrisiTermin(param5);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});

router.route('/odradenidoktori').get(async (req, res) => {
    let param6 = req.query.param6;
    console.log(param6);
    try{
    let result = await uloga.prikazOredenihDoktora(param6);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});

router.route('/ocijenidoktora').post(async (req, res) => {
    let param7 = req.body.param7;
    let param8 = req.body.param8;
    let param9 = req.body.param9;
    console.log(param7, param8,param9);
    try{
    let result = await ocijene.ocijeniDoktora(param7, param8,param9);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});

router.route('/avgocijene').get(async (req, res) => {
    let param10= req.query.param10;
    try{
    let result = await ocijene.avgOcijena(param10);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});
router.route('/zakazaniterminidoktor').get(async (req, res) => {
    let param11 = req.query.param11;
    //console.log(param11);
    try{
    let result = await termin.dohvatiTermineDoktor(param11);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});
router.route('/prikazterminadoktor').get(async (req, res) => {
    let param12 = req.query.param12;
    //console.log(param12);
    try{
    let result = await termin.dohvatiTerminDoktor(param12);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});
router.route('/dodajsazetak').post(async (req, res) => {
    let param13 = req.body.id;
    let param14 = req.body.sazetak;
    //console.log(param13, param14);
    try{
    let result = await termin.dodajSazetakTermina(param13, param14);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});
router.route('/pregledprofila').get(async (req, res) => {
    let param15 = req.query.param15;
    console.log(param15);
    try{
    let result = await uloga.pregledProfila(param15);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});

router.route('/urediprofil').patch(async (req, res) => {
    let param16 = req.body.email;
    let param17 = req.body.ime;
    let param18 = req.body.prezime;
    try{
    let result = await uloga.updateUser(param16, param17, param18);
    res.status(201).send(result);}
    catch(e){
        res.status(500).send("Nešto nije u redu sa bazom.");
    }   
});


app.listen(port, () => {
    console.log(`Service radi na portu ${port}`);
});
