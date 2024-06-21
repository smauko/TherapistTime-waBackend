import mongo from "mongodb";
import db from "../db/connection.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

(   async()=>{
await  db.collection("users").createIndex({Email: 1}, {unique: true});})();

export default{
    async ocijeniDoktora(pacijentEmail, doktorEmail, ocijena){
        try{
            console.log(pacijentEmail, doktorEmail, ocijena);
            let ocijenjivanje = await db.collection('ocijene').updateOne({ pacijentEmail: pacijentEmail, doktorEmail: doktorEmail }, { $set: { ocijena: ocijena } });
            //console.log(doktori);
            return ocijenjivanje;
            }   
        
            catch(e){
            
                throw new Error("Nešto nije u redu sa bazom");
                
            }

        
    },
    async avgOcijena(doktorEmail){
        try {
            const avgOcijenas = await db.collection('ocijene').aggregate([
              {
                $match: {
                  doktorEmail: doktorEmail
                }
              },{
                $group: {
                  _id: "$doktorEmail",
                  averageOcijena: { $avg: "$ocijena" }
                }
              },
              {
                $project: {
                  _id: 0,
                  doktorEmail: "$_id",
                  averageOcijena: 1
                }
              }
            ]).next();
            //console.log(avgOcijenas);
            return avgOcijenas;
          } catch (error) {
            console.error("Error calculating average ocijena per doktor:", error);
            throw error;
          }
        

    }
    }