import PlaylistsRoute from "../routes/PlaylistsRoute.js";

export default {
    plugin: {
        name: 'PlaylistsPlugin',
        version: '1.0.0',
        register: async(server) => server.route(PlaylistsRoute)
    },
}