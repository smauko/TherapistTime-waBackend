import mongo from "mongodb";
import db from "../db/connection.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

(   async()=>{
await  db.collection("users").createIndex({Email: 1}, {unique: true});})();

export default{
    async pregledProfila(email){
        try{
            let osoba = await db.collection('users').findOne({ Email: email }, { projection: {_id:0, Uloga: 1, Email:1, Ime:1, Prezime:1, DatumRodenja:1 }});
            return osoba;
            }   
            catch(e){
                throw new Error("Nešto nije u redu sa bazom");   
            }  
    },
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
    },
    async prikazOredenihDoktora(pacijentEmail){
        try {
        let doktorData = [];
        let doktor = await db.collection('termini').find({pacijent: pacijentEmail, status: 'odrađen'}, { projection: {_id:0, doktor: 1 }}).toArray();
        let uniqueDoktor = [...new Set(doktor.map(item => item.doktor))];
        console.log("Ovo je rezultat", uniqueDoktor);
        for (const doktor of uniqueDoktor) {
            console.log(doktor);
            let data = await db.collection('users').findOne({ Email: doktor }, { projection: { _id: 0, Ime: 1, Prezime: 1, Email: 1 } });
            doktorData.push(data);
        }
        return doktorData;

        } catch (error) {
            console.log("u catch sam");
            throw new Error("Nešto nije uredu sa bazom.");

        }},
        async updateUser(email, ime, prezime){
            try{
                let update = await db.collection('users').updateOne({ Email: email }, { $set: { Ime: ime, Prezime: prezime } });
                return update;
                }   
                catch(e){
                    throw new Error("Nešto nije u redu sa bazom");
                }
}}