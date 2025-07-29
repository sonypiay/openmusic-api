import {AuthRoute} from "../routes/AuthRoute.js";

export default {
    plugin: {
        name: 'AuthPlugin',
        version: '1.0.0',
        register: async(server) => {
            server.route(AuthRoute);
        },
    },
};