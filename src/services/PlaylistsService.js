import PlaylistRepository from "../repositories/PlaylistRepository.js";
import PlaylistsSongRepository from "../repositories/PlaylistsSongRepository.js";
import NotFoundException from "../exception/NotFoundException.js";
import SongsRepository from "../repositories/SongsRepository.js";
import ForbiddenException from "../exception/ForbiddenException.js";
import CollaborationsPlaylistRepository from "../repositories/CollaborationsPlaylistRepository.js";
import PlaylistsActivitiesRepository from "../repositories/PlaylistsActivitiesRepository.js";
import ProducerService from "./ProducerService.js";

class PlaylistsService {
    constructor() {
        this.playlistRepository = new PlaylistRepository;
        this.playlistsSongRepostitory = new PlaylistsSongRepository;
        this.songsRepository = new SongsRepository;
        this.collaborationsPlaylistRepository = new CollaborationsPlaylistRepository;
        this.playlistActivitesRepository = new PlaylistsActivitiesRepository;
        this.producerService = new ProducerService;
    }

    async hasCollaborator(playlistId, userId) {
        return await this.collaborationsPlaylistRepository.existsWithUserIdAndPlaylistId(
            userId,
            playlistId,
        );
    }

    /**
     * Create a new playlist
     *
     * @param request
     * @returns {Promise<{data: {playlistId: string}}>}
     */
    async createPlaylist(request) {
        const result = await this.playlistRepository.create(request);

        return {
            data: {
                playlistId: result,
            },
        };
    }

    /**
     * Get all playlist with user id
     * @param userId
     * @returns {Promise<{data: {playlists: *}}>}
     */
    async getAllPlaylist(userId) {
        const result = await this.playlistRepository.getAll(userId);

        return {
            data: {
                playlists: result,
            },
        };
    }

    /**
     * Get detail playlist with songs
     * @param playlistId
     * @param userId
     * @returns {Promise<{data: {playlist: *}}>}
     */
    async getPlaylistWithSongs(playlistId, userId) {
        const resultPlaylist = await this.playlistRepository.getById(playlistId);

        if( ! resultPlaylist ) throw new NotFoundException("Playlist not found");

        if( resultPlaylist.owner_id !== userId ) {
            if( ! await this.hasCollaborator(playlistId, userId)) {
                throw new ForbiddenException("You have no permission to access this playlist");
            }
        }

        resultPlaylist.songs = await this.playlistsSongRepostitory.getByPlaylistId(playlistId);

        return {
            data: {
                playlist: resultPlaylist,
            },
        };
    }

    /**
     * Delete playlist
     *
     * @param playlistId
     * @param userId
     * @returns {Promise<void>}
     */
    async deletePlaylist(playlistId, userId) {
        const resultPlaylist = await this.playlistRepository.getById(playlistId);

        if( ! resultPlaylist ) throw new NotFoundException("Playlist not found");
        if( resultPlaylist.owner_id !== userId ) throw new ForbiddenException("You have no permission to delete this playlist");

        await this.playlistRepository.delete(playlistId);
    }

    /**
     * Add song to playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async addSongToPlaylist(request) {
        if( ! await this.songsRepository.existsById(request.songId) ) throw new NotFoundException("Song not found");

        const getPlaylist = await this.playlistRepository.getById(request.playlist_id);
        if( ! getPlaylist ) throw new NotFoundException("Playlist not found");

        // cek jika user bukan pemilik playlist
        if( getPlaylist.owner_id !== request.user_id ) {
            if ( ! await this.hasCollaborator(request.playlist_id, request.user_id)) {
                throw new ForbiddenException("You have no permission to add song to this playlist");
            }
        }

        await this.playlistsSongRepostitory.create(request);
        await this.playlistActivitesRepository.store(
            request.playlist_id,
            request.user_id,
            request.songId,
            'add'
        );
    }

    /**
     * Delete song from playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async deleteSongFromPlaylist(request) {
        const getPlaylist = await this.playlistRepository.getById(request.playlist_id);

        if( ! getPlaylist ) {
            throw new NotFoundException("Playlist not found");
        }

        if( getPlaylist.owner_id !== request.user_id ) {
            if( ! await this.hasCollaborator(request.playlist_id, request.user_id) ) {
                throw new ForbiddenException("You have no permission to delete song from this playlist");
            }
        }

        await this.playlistsSongRepostitory.delete(request);
        await this.playlistActivitesRepository.store(
            request.playlist_id,
            request.user_id,
            request.songId,
            'delete'
        );
    }

    /**
     * Get log playlist activities
     *
     * @param playlistId
     * @param userId
     * @returns {Promise<{data: {playlistId, activities: []}}>}
     */
    async getActivities(playlistId, userId) {
        const getPlaylist = await this.playlistRepository.getById(playlistId);

        if( ! getPlaylist ) {
            throw new NotFoundException("Playlist not found");
        }

        if( getPlaylist.owner_id !== userId ) {
            if( ! await this.hasCollaborator(playlistId, userId) ) {
                throw new ForbiddenException("You have no permission to delete song from this playlist");
            }
        }

        const results = await this.playlistActivitesRepository.getAll(playlistId, userId);

        return {
            data: {
                playlistId: playlistId,
                activities: results
            }
        };
    }

    /**
     * Export playlist
     *
     * @param targetEmail
     * @param playlistId
     * @param userId
     * @returns {Promise<{playlist: *}>}
     */
    async exportPlaylist(targetEmail, playlistId, userId) {
        const getPlaylist = await this.playlistRepository.getById(playlistId);

        if( ! getPlaylist ) {
            throw new NotFoundException("Playlist not found");
        }

        if( getPlaylist.owner_id !== userId ) {
            throw new ForbiddenException("You have no permission to export this playlist");
        }

        const filename = "playlist_" + getPlaylist.id + ".json";
        const message = JSON.stringify({
            file: filename,
            email: targetEmail,
            name: getPlaylist.name,
            playlistId: playlistId,
        });

        this.producerService.setMessage(message);
        await this.producerService.send("email");
    }
}

export default PlaylistsService;