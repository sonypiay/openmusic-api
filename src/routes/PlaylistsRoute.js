import PlaylistsController from "../controllers/PlaylistsController.js";

export default [
    {
        path: '/playlists',
        method: 'GET',
        handler: (request, response) => PlaylistsController.getAllPlaylists(request, response),
    },
    {
        path: '/playlists',
        method: 'POST',
        handler: (request, response) => PlaylistsController.createPlaylist(request, response),
    },
    {
        path: '/playlists/{id}',
        method: 'DELETE',
        handler: (request, response) => PlaylistsController.deletePlaylist(request, response),
    },
    {
        path: '/playlists/{id}/songs',
        method: 'GET',
        handler: (request, response) => PlaylistsController.getPlaylistWithSongs(request, response),
    },
    {
        path: '/playlists/{id}/songs',
        method: 'POST',
        handler: (request, response) => PlaylistsController.addSongToPlaylist(request, response),
    },
    {
        path: '/playlists/{id}/songs',
        method: 'DELETE',
        handler: (request, response) => PlaylistsController.deleteSongFromPlaylist(request, response),
    },
];