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
);      //console.log(nedostupniTermini);

        let dostupniTermini = slobodniTermini.filter(termin => !nedostupniTermini.includes(termin));
        //console.log(dostupniTermini);
        return dostupniTermini;
            
        } catch (error) {
            console.log("u catch sam");
            throw new Error("Nešto nije uredu sa bazom.");
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
            zoom: terminData.zoom,
            sazetak_termina: ""
        
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
            
        };
    },
    async dohvatiTermine(pacijentEmail){
        try {
        let termini = await db.collection('termini').find( {pacijent: pacijentEmail} ).sort({ datum: -1 }).toArray();

        let now = new Date();
        let ternutacno = this.formatDate(now);
        //console.log("now", ternutacno);

        for (let termin of termini) {
            let ocijena = {
                pacijentEmail: pacijentEmail,
                doktorEmail: termin.doktor,
                ocijena: "0"
            };
            //console.log("terminDate", termin.datum);
            if (termin.datum < ternutacno && termin.status !== 'odrađen') {
                let objectId = new mongo.ObjectId(termin._id);
                //console.log(objectId);
                let existingOcijena = await db.collection("ocijene").findOne({
                    doktorEmail: termin.doktor,
                    pacijentEmail: pacijentEmail
                  });
                  
                if (!existingOcijena) {
                    let dodajocijenu = await db.collection("ocijene").insertOne(ocijena);
                //console.log(ocijena);   
            }   
                
                await db.collection('termini').updateOne({ _id: objectId }, { $set: { status: 'odrađen' } });
                termin.status = 'odrađen'; 
            }
        }


        let result = termini.map(termin => ({
            idTermina: termin._id,
            vrstaEpizode: termin.vrstaEpizode,
            datumTermina: termin.datum,
            vrijemeTermina: termin.vrijeme,
            status: termin.status
        }));
        return result;

        } catch (error) {
            throw new Error("Nešto nije uredu sa bazom.");
        };
    },
        async dohvatiTermin(idTermina){
            const objectId = new mongo.ObjectId(idTermina);
            try {
            let termin1 = await db.collection('termini').findOne({_id: objectId});
            //console.log("pronasao sam podatke o terminu", termin1.doktor);
            let doktorEmail = termin1.doktor;
            let doktorData = await db.collection('users').findOne({ Email: doktorEmail }, { projection: { _id: 0,  Ime: 1, Prezime: 1, DatumRodenja: 1 } });
            //console.log("imam podatke o doktoru", doktorData);
            let result = {...termin1, ...doktorData};
            //console.log(result);
            return result;
    
            } catch (error) {
                throw new Error("Nešto nije uredu sa bazom.");

            };

    },
    async izbrisiTermin(idTermina){
        const objectId = new mongo.ObjectId(idTermina);
        try {
        let result = await db.collection('termini').deleteOne({_id: objectId});
        //console.log("Ovo je rezultat o brisanju", result);


        return result;

        } catch (error) {
            console.log("u catch sam");
            throw new Error("Nešto nije uredu sa bazom.");

        };

},
    formatDate(date) {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    let year = date.getFullYear();
    return `${day}.${month}.${year}`;
},
async dohvatiTermineDoktor(doktorEmail){
    try {
    //console.log(doktorEmail);
    let termini = await db.collection('termini').find( {doktor: doktorEmail} ).sort({ datum: -1 }).toArray();
    //console.log(termini);
    let now = new Date();
    let ternutacno = this.formatDate(now);
    //console.log("now", ternutacno);

    for (let termin of termini) {
        //console.log("terminDate", termin.datum);
        if (termin.datum < ternutacno && termin.status !== 'odrađen') {
            let objectId = new mongo.ObjectId(termin._id);
            //console.log(objectId);
            await db.collection('termini').updateOne({ _id: objectId }, { $set: { status: 'odrađen' } });
            termin.status = 'odrađen'; 
        }
    }


    let result = termini.map(termin => ({
        idTermina: termin._id,
        vrstaEpizode: termin.vrstaEpizode,
        datumTermina: termin.datum,
        vrijemeTermina: termin.vrijeme,
        status: termin.status
    }));
    //console.log(result);
    return result;

    } catch (error) {
        throw new Error("Nešto nije uredu sa bazom.");
    };
},
async dohvatiTerminDoktor(idTermina){
    const objectId = new mongo.ObjectId(idTermina);
    try {
    let termin1 = await db.collection('termini').findOne({_id: objectId});
    //console.log("pronasao sam podatke o terminu", termin1.doktor);
    let pacijentEmail = termin1.pacijent;
    let pacijentData = await db.collection('users').findOne({ Email: pacijentEmail }, { projection: { _id: 0,  Ime: 1, Prezime: 1, DatumRodenja: 1 } });
    //console.log("imam podatke o doktoru", doktorData);
    let result = {...termin1, ...pacijentData};
    //console.log(result);
    return result;

    } catch (error) {
        throw new Error("Nešto nije uredu sa bazom.");

    };

},
async dodajSazetakTermina(idTermina, sazetak){
    try {
    const objectId = new mongo.ObjectId(idTermina);
    let result = await db.collection('termini').updateOne({ _id: objectId }, { $set: { sazetak_termina: sazetak } });
    return result;
    } catch (error) {
        throw new Error("Nešto nije uredu sa bazom.");
    }
    

},

    
}