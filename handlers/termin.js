import mongo from "mongodb";
import db from "../db/connection.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

(   async()=>{
await  db.collection("users").createIndex({Email: 1}, {unique: true});})();

export default{

    async dostupniTermini(doktor_email, datum_termina){
        let slobodniTermini = ["08:00",  "09:30", "11:00", "12:30", "17:00", "18:30", "20:00"];
        try {

        let termini = await db.collection('termini').find( {doktor: doktor_email, status: "neodrađen", datum: datum_termina } ).toArray();

        let nedostupniTermini = termini.map(termin =>termin.vrijeme
);

        let dostupniTermini = slobodniTermini.filter(termin => !nedostupniTermini.includes(termin));
        // console.log(dostupniTermini);
        return dostupniTermini;
            
        } catch (error) {
            //console.log("u catch sam");
            throw new Error("Termin već postoji ili je neka greska sa podacima");
        }

    },
    async dodajTermin(terminData){
        let doc = {
            opisEpizode: terminData.opis_epizode,
            vrstaEpizode: terminData.vrsta_epizode,
            vrijeme: terminData.vrijeme_termina,
            datum: terminData.datum_termina,
            pacijent:terminData.pacijent,
            doktor:terminData.doktor,
            status: terminData.status,
            zoom: terminData.zoom
        
        };
        try{
        let result= await db.collection("termini").insertOne(doc);
        if (result && result.insertedId) {
            // console.log(result, result.insertedId);
            return result.insertedId;
        }   
    }
        catch(e){
            throw new Error("Termin već postoji ili je neka greska sa podacima");
            
        }
    },
}