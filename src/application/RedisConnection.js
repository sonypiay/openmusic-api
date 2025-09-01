import Redis from "ioredis";

class RedisConnection {
    init() {
        return new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            db: process.env.REDIS_DB,
        });
    }
}

export default RedisConnection;