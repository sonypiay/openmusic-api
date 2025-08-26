import amqp from "amqplib";

class ConsumerService {
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