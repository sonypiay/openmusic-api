import PlaylistsController from "../controllers/PlaylistsController.js";
import CollaborationsPlaylistController from "../controllers/CollaborationsPlaylistController.js";

export default [
    {
        path: '/playlists',
        method: 'GET',
        handler: (request, response) => PlaylistsController.getAllPlaylists(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/playlists',
        method: 'POST',
        handler: (request, response) => PlaylistsController.createPlaylist(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/playlists/{id}',
        method: 'DELETE',
        handler: (request, response) => PlaylistsController.deletePlaylist(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/playlists/{id}/songs',
        method: 'GET',
        handler: (request, response) => PlaylistsController.getPlaylistWithSongs(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/playlists/{id}/activities',
        method: 'GET',
        handler: (request, response) => PlaylistsController.getActivities(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/playlists/{id}/songs',
        method: 'POST',
        handler: (request, response) => PlaylistsController.addSongToPlaylist(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/playlists/{id}/songs',
        method: 'DELETE',
        handler: (request, response) => PlaylistsController.deleteSongFromPlaylist(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/collaborations',
        method: 'POST',
        handler: (request, response) => CollaborationsPlaylistController.addCollaborator(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/collaborations',
        method: 'DELETE',
        handler: (request, response) => CollaborationsPlaylistController.deleteCollaborator(request, response),
        options: {
            auth: 'token',
        },
    },
    {
        path: '/export/playlists/{id}',
        method: 'POST',
        handler: (request, response) => PlaylistsController.exportPlaylist(request, response),
        options: {
            auth: 'token',
        },
    },
];