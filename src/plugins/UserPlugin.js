import {UserRoute} from "../routes/UserRoute.js";

export default {
    plugin: {
        name: 'UserPlugin',
        version: '1.0.0',
        register: async(server) => {
            server.route(UserRoute);
        },
    },
}