import QueueConnection from "../application/QueueConnection.js";

class ProducerService {
    queue = null;
    message = null;
    channel = null;

    constructor() {
        this.queueConnection = new QueueConnection;
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
        this.channel = await this.queueConnection.createChannel();

        if( queue ) {
            await this.setQueue(queue);
        }

        await this.channel.sendToQueue(this.getQueue(), Buffer.from(this.getMessage()));
    }
}

export default ProducerService;