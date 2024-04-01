import mongo from "mongodb";
import db from "../db/connection.js";
import bcrypt from 'bcrypt';

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
    }
}