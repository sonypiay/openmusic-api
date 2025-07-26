import {AlbumRoute} from "../routes/AlbumRoute.js";

export default {
    plugin: {
        name: 'AlbumPlugin',
        version: '1.0.0',
        register: async(server) => {
            server.route(AlbumRoute);
        }
    }
};