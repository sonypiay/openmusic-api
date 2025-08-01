import NotFoundException from "../exception/NotFoundException.js";
import ForbiddenException from "../exception/ForbiddenException.js";
import PlaylistRepository from "../repositories/PlaylistRepository.js";
import CollaborationsPlaylistRepository from "../repositories/CollaborationsPlaylistRepository.js";
import UserRepository from "../repositories/UserRepository.js";

class CollaborationsPlaylistService {
    constructor() {
        this.playlistRepository = new PlaylistRepository;
        this.collaborationsPlaylistRepository = new CollaborationsPlaylistRepository;
        this.userRepository = new UserRepository;
    }

    /**
     * Add collaborator playlist
     *
     * @param request
     * @returns {Promise<{data: {collaboratorId: string}}>}
     */
    async addCollaborator(request) {
        const user = await this.userRepository.existsById(request.userId);
        if( ! user ) throw new NotFoundException("User not found");

        const getPlaylist = await this.playlistRepository.getById(request.playlistId);
        if( ! getPlaylist ) {
            throw new NotFoundException("Playlist not found");
        }

        if( getPlaylist.owner_id !== request.owner_id ) {
            throw new ForbiddenException("You have no permission to add collaborator to this playlist");
        }

        const result = await this.collaborationsPlaylistRepository.create(request);

        return {
            data: {
                collaborationId: result,
            },
        };
    }

    /**
     * Delete collaborator playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async deleteCollaborator(request) {
        const getPlaylist = await this.playlistRepository.getById(request.playlistId);

        if( ! getPlaylist ) {
            throw new NotFoundException("Playlist not found");
        }

        if( getPlaylist.owner_id !== request.owner_id ) {
            throw new ForbiddenException("You have no permission to add collaborator to this playlist");
        }

        await this.collaborationsPlaylistRepository.delete(request);
    }
}

export default CollaborationsPlaylistService;