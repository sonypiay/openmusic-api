import PlaylistsService from "../services/PlaylistsService.js";
import PlaylistsValidation from "../validation/PlaylistsValidation.js";
import PlaylistsSongValidation from "../validation/PlaylistsSongValidation.js";

class PlaylistsController {
    constructor() {
        this.playlistsService = new PlaylistsService;
        this.playlistValidation = new PlaylistsValidation;
        this.playlistSongValidation = new PlaylistsSongValidation;
    }

    /**
     * Create a new playlist
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async createPlaylist(req, res) {
        const payload = this.playlistValidation.create(req.payload);
        payload.user_id = req.auth.credentials.user_id;
        const result = await this.playlistsService.createPlaylist(payload);

        return res.response({
            status: "success",
            ...result,
        }).code(201);
    }

    /**
     * Get all playlists
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getAllPlaylists(req, res) {
        const { user_id } = req.auth.credentials;
        const result = await this.playlistsService.getAllPlaylist(user_id);

        return res.response({
            status: "success",
            ...result,
        });
    }

    async getPlaylistWithSongs(req, res) {
        const playlistId = req.params.id;
        const userId = req.auth.credentials.user_id;
        const result = await this.playlistsService.getPlaylistWithSongs(playlistId, userId);

        return res.response({
            status: "success",
            ...result,
        });
    }

    /**
     * Delete playlist
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async deletePlaylist(req, res) {
        const playlistId = req.params.id;
        const userId = req.auth.credentials.user_id;

        await this.playlistsService.deletePlaylist(playlistId, userId);

        return res.response({
            status: "success",
            message: "Playlist has been deleted",
        });
    }

    /**
     * Add song to playlist
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async addSongToPlaylist(req, res) {
        const payload = this.playlistSongValidation.addOrDelete(req.payload);
        payload.playlist_id = req.params.id;
        payload.user_id = req.auth.credentials.user_id;

        await this.playlistsService.addSongToPlaylist(payload);

        return res.response({
            status: "success",
            message: "Song has been added to playlist",
        }).code(201);
    }

    /**
     * Delete song from playlist
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async deleteSongFromPlaylist(req, res) {
        const payload = this.playlistSongValidation.addOrDelete(req.payload);
        payload.playlist_id = req.params.id;
        payload.user_id = req.auth.credentials.user_id;

        await this.playlistsService.deleteSongFromPlaylist(payload);

        return res.response({
            status: "success",
            message: "Song has been deleted from playlist",
        });
    }

    /**
     * Get log playlist activities
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getActivities(req, res) {
        const playlistId = req.params.id;
        const userId = req.auth.credentials.user_id;
        const result = await this.playlistsService.getActivities(playlistId, userId);

        return res.response({
            status: "success",
            ...result,
        });
    }
}

export default new PlaylistsController;