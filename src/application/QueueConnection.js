import amqp from "amqplib";

class QueueConnection {
    client = null;

    async createConnection() {
        this.client = await amqp.connect(process.env.RABBITMQ_SERVER);
    }

    async createChannel() {
        if (!this.client) {
            await this.createConnection();
        }

        return await this.client.createChannel();
    }
}

export default QueueConnection;