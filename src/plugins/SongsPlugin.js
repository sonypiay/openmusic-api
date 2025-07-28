import {SongsRoute} from "../routes/SongsRoute.js";

export default {
    plugin: {
        name: 'SongsPlugin',
        version: '1.0.0',
        register: async(server) => {
            server.route(SongsRoute);
        }
    },
}