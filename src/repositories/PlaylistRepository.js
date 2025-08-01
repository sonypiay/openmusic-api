import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

class PlaylistRepository {
    constructor() {
        this.connection = new Pool;
        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt;
    }

    /**
     * Create a new playlist
     *
     * @param request
     * @returns {Promise<string>}
     */
    async create(request) {
        const query = {
            text: `INSERT INTO playlists (id, user_id, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            values: [
                uuidv4(),
                request.user_id,
                request.name,
                this.createdAt,
                this.updatedAt,
            ]
        };

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    /**
     * Get all playlist by user id
     *
     * @param userId
     * @returns {Promise<*>}
     */
    async getAll(userId) {
        const sqlText = `
        SELECT
            p.id,
            p.name,
            u.username
        FROM playlists AS p
        INNER JOIN users AS u ON p.user_id = u.id WHERE u.id = $1
        ORDER BY p.name ASC`;

        const query = {
            text: sqlText,
            values: [userId]
        };

        const result = await this.connection.query(query);
        return result.rows;
    }

    async getById(id) {
        const sqlText = `
        SELECT
            p.id,
            p.name,
            u.username,
            u.id AS user_id
        FROM playlists AS p
        INNER JOIN users AS u ON p.user_id = u.id WHERE
        p.id = $1`;

        const query = {
            text: sqlText,
            values: [id]
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Get detail playlist
     *
     * @param id
     * @param userId
     * @returns {Promise<*|null>}
     */
    async getByIdAndUserId(id, userId) {
        const sqlText = `
        SELECT
            p.id,
            p.name,
            u.username
        FROM playlists AS p
        INNER JOIN users AS u ON p.user_id = u.id WHERE
        p.id = $1 AND
        u.id = $2`;

        const query = {
            text: sqlText,
            values: [id, userId]
        };

        const results = await this.connection.query(query);
        return results.rows.length > 0 ? results.rows[0] : null;
    }

    /**
     * Delete playlist
     *
     * @param id
     * @param userId
     * @returns {Promise<void>}
     */
    async delete(id) {
        const query = {
            text: `DELETE FROM playlists WHERE id = $1`,
            values: [id]
        };

        await this.connection.query(query);
    }

    /**
     * Check if playlist exists by id
     * @param id
     * @param userId
     * @returns {Promise<boolean>}
     */
    async existsById(id) {
        const query = {
            text: `SELECT id FROM playlists WHERE id = $1`,
            values: [id]
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }
}

export default PlaylistRepository;