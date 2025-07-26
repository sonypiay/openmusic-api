import { Client, Pool } from "pg";
import Logging from "./Logging.js";

export const DatabaseConnection = new Pool();

DatabaseConnection.on("error", (err) => Logging.error(err));