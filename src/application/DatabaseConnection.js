import { Client } from "pg";
import Logging from "./Logging.js";

const DatabaseConnection = new Client();

DatabaseConnection.on("error", (err) => Logging.error(err));

export default DatabaseConnection;