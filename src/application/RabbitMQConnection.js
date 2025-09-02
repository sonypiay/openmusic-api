import Configuration from "./Configuration.js";
import amqp from "amqplib";

class RabbitMQConnection {
    getUserCredentials() {
        if( !Configuration.rabbitmq.username || !Configuration.rabbitmq.password )
            return null;

        return `${Configuration.rabbitmq.username}:${Configuration.rabbitmq.password}@`;
    }

    getServerUrl() {
        return `${Configuration.rabbitmq.host}:${Configuration.rabbitmq.port}${Configuration.rabbitmq.virtualHost}`;
    }

    async connection() {
        return await amqp.connect(Configuration.rabbitmq.url, {
            connectionTimeout: Configuration.rabbitmq.timeout,
        });
    }

    async createChannel(connection) {
        return await connection.createChannel();
    }

    async close(connection) {
        await connection.close();
    }
}

export default new RabbitMQConnection;