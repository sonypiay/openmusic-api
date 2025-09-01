import {Pool} from "pg";
import {v4 as uuidv4} from "uuid";

class UserAlbumLikesRepository {
    constructor() {
        this.connection = new Pool;
    }

    /**
     * Create a new user album like
     *
     * @param userId
     * @param albumId
     * @returns {Promise<void>}
     */
    async create(userId, albumId) {
        const query = {
            text: `INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id`,
            values: [
                uuidv4(),
                userId,
                albumId,
            ],
        };

        await this.connection.query(query);
    }

    /**
     * Delete user album like
     *
     * @param userId
     * @param albumId
     * @returns {Promise<void>}
     */
    async delete(userId, albumId) {
        const query = {
            text: `DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2`,
            values: [
                userId,
                albumId,
            ],
        };

        await this.connection.query(query);
    }

    /**
     * Check if user album like exists
     *
     * @param userId
     * @param albumId
     * @returns {Promise<boolean>}
     */
    async exists(userId, albumId) {
        const query = {
            text: `SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2`,
            values: [
                userId,
                albumId,
            ],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }

    /**
     * Get likes count by album id
     * @param albumId
     * @returns {Promise<number>}
     */
    async getLikesCount(albumId){
        const query = {
            text: `SELECT COUNT(id) AS count FROM user_album_likes WHERE album_id = $1`,
            values: [
                albumId,
            ],
        };

        const result = await this.connection.query(query);
        return parseInt(result.rows[0].count);
    }
}

export default UserAlbumLikesRepository;