import Redis from "ioredis";
import Configuration from "./Configuration.js";

class RedisConnection {
    constructor(connection) {
        this.connection = connection ?? Configuration.redis.url;
    }

    init() {
        return new Redis(this.connection);
    }
}

export default RedisConnection;