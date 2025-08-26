import amqp from "amqplib";

class ProducerService {
    constructor() {
        this.client = null;
        this.queue = null;
        this.channel = null;
        this.options = {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
            },
        };
    }

    async createConnection() {
        if( ! this.client ) {
            this.client = await amqp.connect(process.env.RABBITMQ_SERVER);
        }
    }

    async createChannel() {
        if (!this.client) {
            await this.createConnection();
        }

        if( ! this.channel ) {
            this.channel = await this.client.createChannel();
        }
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

        await this.channel.assertQueue(this.queue, this.getQueueOptions());
    }

    getQueue() {
        return this.queue;
    }

    setQueueOptions(options) {
        if( options ) {
            this.options = options;
        }
    }

    getQueueOptions() {
        return this.options;
    }

    setMessage(message, headers = {}) {
        this.message = message;

        if( headers ) {
            this.setHeaders(headers);
        }
    }

    getMessage() {
        return this.message;
    }

    setHeaders(headers) {
        if( headers ) {
            this.headers = headers;
        }
    }

    getHeaders() {
        return this.headers ?? {};
    }

    async send(queue) {
        if( ! this.channel ) {
            await this.createChannel();
        }

        if( queue ) {
            await this.setQueue(queue, this.getQueueOptions());
        }

        await this.channel.sendToQueue(
            this.getQueue(),
            Buffer.from(this.getMessage()),
            {
                headers: this.getHeaders(),
            }
        );

        await this.closeConnection();
    }
}

export default ProducerService;