import Logging from "../application/Logging.js";
import amqp from "amqplib";

class ConsumerService {
    channel = null;

    async createConnection() {
        this.client = await amqp.connect(process.env.RABBITMQ_SERVER);
    }

    async createChannel() {
        if (!this.client) {
            await this.createConnection();
        }

        this.channel = await this.client.createChannel();
    }

    async setQueue(queue) {
        this.queue = queue;

        await this.channel.assertQueue(this.queue, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
            },
        });
    }

    getQueue() {
        return this.queue;
    }

    async listen(queue, callback) {
        await this.createChannel();

        if( queue ) {
            await this.setQueue(queue);
        }

        console.info(`Connected to queue ${this.getQueue()}`);
        console.info(`[*] Waiting for messages in ${this.getQueue()}. To exit press CTRL+C`);
        this.channel.consume(this.getQueue(), callback, { noAck: true });
    }
}

export default ConsumerService;