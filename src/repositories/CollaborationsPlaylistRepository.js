import {Pool} from "pg";
import {v4 as uuidv4} from "uuid";

class CollaborationsPlaylistRepository {
    constructor() {
        this.connection = new Pool;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Create a new collaborator playlist
     * @param request
     * @returns {Promise<string>}
     */
    async create(request) {
        const query = {
            text: `INSERT INTO collaborations_playlist (id, user_id, playlist_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [
                uuidv4(),
                request.userId,
                request.playlistId,
                this.createdAt,
            ],
        };

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    /**
     * Delete collaborator playlist
     *
     * @param request
     * @returns {Promise<void>}
     */
    async delete(request) {
        const query = {
            text: `DELETE FROM collaborations_playlist WHERE user_id = $1 AND playlist_id = $2`,
            values: [
                request.userId,
                request.playlistId,
            ],
        };

        await this.connection.query(query);
    }

    /**
     * Check if user exists in collaboration playlist
     *
     * @param userId
     * @param playlistId
     * @returns {Promise<boolean>}
     */
    async existsWithUserIdAndPlaylistId(userId, playlistId) {
        const sqlText = `
        SELECT 
            cp.id 
        FROM collaborations_playlist AS cp WHERE 
            cp.user_id = $1 AND 
            cp.playlist_id = $2`;
        const query = {
            text: sqlText,
            values: [userId, playlistId],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }
}

export default CollaborationsPlaylistRepository;