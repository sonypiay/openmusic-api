import hapi from '@hapi/hapi';
import Logging from "./Logging.js";
import ResponseException from "../exception/ResponseException.js";

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

    scheme(name, scheme) {
        this.server.auth.scheme(name, scheme);
    }

    strategy(name, strategy) {
        this.server.auth.strategy(name, strategy);
    }

    async run() {
        this.server.events.on('request', (request, event, tags) => {
            if( tags.error ) {
                Logging.error(event.error.message);
            }
        });

        this.server.ext('onPreResponse', (request, h) => {
            const { response } = request;

            if( response instanceof ResponseException ) {
                return h.response({
                    status: response.status,
                    message: response.message,
                })
                    .code(response.statusCode);
            }

            if( response.isBoom ) {
                if( response.output.statusCode === 500 ) {
                    Logging.error(response.message);

                    return h.response({
                        status: "error",
                        message: "Whoops, something went wrong.",
                    })
                        .code(500);
                }
            }

            return h.continue;
        });

        await this.server.start();
        Logging.info(`App started on port ${process.env.PORT}`);
    }
}

export default Application;