import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

class PlaylistsSongRepository {
    constructor() {
        this.connection = new Pool;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Add song into playlist
     *
     * @param request
     * @returns {Promise<string>}
     */
    async create(request) {
        const query = {
            text: `INSERT INTO playlists_song (id, playlist_id, song_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [
                uuidv4(),
                request.playlist_id,
                request.songId,
                this.createdAt,
            ],
        };

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    /**
     * Delete song from playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async delete(request) {
        const query = {
            text: `DELETE FROM playlists_song WHERE playlist_id = $1 AND song_id = $2`,
            values: [
                request.playlist_id,
                request.songId,
            ],
        };

        await this.connection.query(query);
    }

    /**
     * Get songs by playlist id
     *
     * @param playlistId
     * @returns {Promise<[]>}
     */
    async getByPlaylistId(playlistId) {
        const sqlText = `
        SELECT
            s.id,
            s.title,
            s.performer
        FROM playlists_song AS ps
        INNER JOIN songs AS s ON ps.song_id = s.id
        WHERE ps.playlist_id = $1`;
        const query = {
            text: sqlText,
            values: [playlistId],
        };

        const result = await this.connection.query(query);
        return result.rows;
    }
}

export default PlaylistsSongRepository;