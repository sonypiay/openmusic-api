import CollaborationsPlaylistService from "../services/CollaborationsPlaylistService.js";
import PlaylistsValidation from "../validation/PlaylistsValidation.js";

class CollaborationsPlaylistController {
    constructor() {
        this.collaborationsPlaylistService = new CollaborationsPlaylistService;
        this.playlistValidation = new PlaylistsValidation;
    }

    /**
     * Add collaborator playlist
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async addCollaborator(req, res) {
        const payload = this.playlistValidation.collaborator(req.payload);
        payload.owner_id = req.auth.credentials.user_id;

        const result = await this.collaborationsPlaylistService.addCollaborator(payload);

        return res.response({
            status: "success",
            ...result,
        }).code(201);
    }

    /**
     * Delete collaborator playlist
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async deleteCollaborator(req, res) {
        const payload = this.playlistValidation.collaborator(req.payload);
        payload.owner_id = req.auth.credentials.user_id;

        await this.collaborationsPlaylistService.deleteCollaborator(payload);

        return res.response({
            status: "success",
            message: "Collaborator playlist has been deleted",
        });
    }
}

export default new CollaborationsPlaylistController;