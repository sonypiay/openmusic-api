import hapi from '@hapi/hapi';
import Logging from "./Logging.js";

class Application {
    constructor() {
        this.server = hapi.server({
            port: process.env.PORT,
            host: process.env.HOST,
            routes: {
                cors: {
                    origin: ['*'],
                },
            }
        });
    }

    async register(payload) {
        await this.server.register(payload);
    }

    async run() {
        this.server.events.on('request', (request, event, tags) => {
            if( tags.error ) {
                Logging.error(event.error.message);
            }
        });

        await this.server.start();
        Logging.info(`App started on port ${process.env.PORT}`);
    }
}

export default Application;