import { MongoClient } from "mongodb";
const connectionString =
"mongodb+srv://smauko:hodnikZeleni890@cluster0.nai1gq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(connectionString);
let conn = null;
try {
	console.log("Trying to establish connection...");
	conn = await client.connect();
	console.log("Uspješno povezano na bazu :)");
} catch (e) {
	console.log("nes je krivo, nisi se mogao povezati", e);
}
let db = conn.db("testDB");
export default db;