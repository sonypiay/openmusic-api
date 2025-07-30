import PlaylistRepository from "../repositories/PlaylistRepository.js";
import PlaylistsSongRepository from "../repositories/PlaylistsSongRepository.js";
import NotFoundException from "../exception/NotFoundException.js";

class PlaylistsService {
    constructor() {
        this.playlistRepository = new PlaylistRepository;
        this.playlistsSongRepostitory = new PlaylistsSongRepository;
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
        const resultPlaylist = await this.playlistRepository.getById(playlistId, userId);
        if( ! resultPlaylist ) throw new NotFoundException("Playlist not found");

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
        const resultPlaylist = await this.playlistRepository.getById(playlistId, userId);
        if( ! resultPlaylist ) throw new NotFoundException("Playlist not found");

        await this.playlistRepository.delete(playlistId, userId);
    }

    /**
     * Add song to playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async addSongToPlaylist(request) {
        if( ! await this.playlistRepository.existsById(request.playlist_id, request.user_id) )
            throw new NotFoundException("Playlist not found");

        await this.playlistsSongRepostitory.create(request);
    }

    /**
     * Delete song from playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async deleteSongFromPlaylist(request) {
        if( ! await this.playlistRepository.existsById(request.playlist_id, request.user_id) )
            throw new NotFoundException("Playlist not found");

        await this.playlistsSongRepostitory.delete(request);
    }
}

export default PlaylistsService;