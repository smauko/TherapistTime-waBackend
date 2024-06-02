import mongo from "mongodb";
import db from "../db/connection.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

(   async()=>{
await  db.collection("users").createIndex({Email: 1}, {unique: true});})();

export default{
    async registerUser(userData){
        let doc = {
            Ime: userData.ime,
            Prezime: userData.prezime,
            DatumRodenja: userData.datum_rodenja,
            Uloga:userData.uloga,
            Email:userData.email,
            Password: await bcrypt.hash(userData.password, 10)
        };
        try{
        let result= await db.collection("users").insertOne(doc);
        if (result && result.insertedId) {
            console.log(result, result.insertedId);
            return result.insertedId;
        }   
    }
        catch(e){
            throw new Error("Korisnik već postoji ili je neka greska sa podacima");
            
        }
    },

    async logInUser(email, password) {
        console.log("Body:", email, password);
        let user = await db.collection('users').findOne({ Email: email });
        console.log("u funkciji sam(podaci sa baze):", email, user.Password);
        if (user && user.Password && (await bcrypt.compare(password, user.Password))) {
            delete user.Password; 
            let token = jwt.sign(user, process.env.JWT_SECRET, {
                algorithm: 'HS512',
                expiresIn: '1 week',
            });
            return {
                token,
                email: user.Email, 
            };
        } else {
            throw new Error('Greška prilikom login-a');
        }
    },
    verify(req, res, next){
        if (req.headers['authorization']) {
        let authorization = req.headers.authorization.split(" ");
        let type = authorization[0];
        let token = authorization[1];
        try {
        if(type !== 'Bearer'){
            console.log('uso sam u try/if')
            res.status(401).send();
            return res.status(401).send();
        }
        else {
            req.jwt = jwt.verify(token, process.env.JWT_SECRET);
            return next();
        }}catch (err) {
            return res.status(401).send(); // HTTP not-authorized
        }
    } else {
        return res.status(401).send(); // HTTP invalid request
    }

    }
}