import Application from './application/Application.js';
import ResponseException from "./exception/ResponseException.js";
import Plugins from "./plugins/Plugins.js";

const app = new Application();

app.server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if( response instanceof ResponseException ) {
        return h.response({
            status: response.status,
            message: response.message,
        })
            .code(response.statusCode);
    }

    return h.continue;
});

await app.register(Plugins);

await app.run();