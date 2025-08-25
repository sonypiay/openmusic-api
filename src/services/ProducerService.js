import amqp from "amqplib";

class ProducerService {
    queue = null;
    message = null;
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

    async closeConnection() {
        if (this.channel) {
            await this.channel.close();
        }

        if (this.client) {
            await this.client.close();
        }
    }

    async setQueue(queue) {
        this.queue = queue;

        await this.channel.assertQueue(this.queue, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
            }
        });
    }

    getQueue() {
        return this.queue;
    }

    setMessage(message) {
        this.message = message;
    }

    getMessage() {
        return this.message;
    }

    async send(queue) {
        await this.createChannel();

        if( queue ) {
            await this.setQueue(queue);
        }

        await this.channel.sendToQueue(this.getQueue(), Buffer.from(this.getMessage()));

        setTimeout(async () => {
            await this.closeConnection();
        }, 5000);
    }
}

export default ProducerService;