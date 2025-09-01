import {Pool} from "pg";
import {v4 as uuidv4} from "uuid";

class PlaylistsActivitiesRepository {
    constructor() {
        this.connection = new Pool;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Store log playlist activity
     *
     * @param playlistId
     * @param userId
     * @param songId
     * @param action
     * @returns {Promise<string>}
     */
    async store(playlistId, userId, songId, action = 'add') {
        const query = {
            text: `INSERT INTO playlists_activities (id, playlist_id, user_id, song_id, action, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            values: [
                uuidv4(),
                playlistId,
                userId,
                songId,
                action,
                this.createdAt,
            ],
        };

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    /**
     * Get all log playlist activities
     * @param playlistId
     * @param userId
     * @returns {Promise<[*]>}
     */
    async getAll(playlistId, userId) {
        const sqlText = `
        SELECT
        u.username,
        s.title,
        log.action,
        log.created_at AS time
        FROM playlists_activities AS log
        LEFT JOIN users AS u ON log.user_id = u.id
        LEFT JOIN songs AS s ON log.song_id = s.id WHERE
        log.playlist_id = $1 AND
        (
            log.user_id = $2 OR
            EXISTS (
                SELECT 1 FROM collaborations_playlist AS cp WHERE cp.user_id = $2 AND cp.playlist_id = log.playlist_id
            )
        )
        ORDER BY log.created_at DESC`;

        const query = {
            text: sqlText,
            values: [playlistId, userId],
        };

        const result = await this.connection.query(query);
        return result.rows;
    }
}

export default PlaylistsActivitiesRepository;