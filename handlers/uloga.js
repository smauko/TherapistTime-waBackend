import mongo from "mongodb";
import db from "../db/connection.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

(   async()=>{
await  db.collection("users").createIndex({Email: 1}, {unique: true});})();

export default{
    async sviDoktori(){
        try{
            
            let doktori = await db.collection('users').find({ Uloga: "Doktor" }).toArray();
            //console.log(doktori);
            return doktori.map(doktor => ({
                Email: doktor.Email,
                Ime: doktor.Ime,
                Prezime: doktor.Prezime
            }));
            }   
        
            catch(e){
            
                throw new Error("Nešto nije u redu sa bazom");
                
            }
        
    }
}