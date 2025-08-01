import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
    constructor() {
        this.connection = new Pool;
        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt;
    }

    /**
     * Create a new user
     *
     * @param data
     * @returns {Promise<string>}
     */
    async create(data) {
        const query = {
            text: `INSERT INTO users (id, username, password, fullname, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            values: [
                uuidv4(),
                data.username,
                data.password,
                data.fullname ?? null,
                this.createdAt,
                this.updatedAt,
            ],
        };

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    /**
     * Login user by username
     *
     * @param username
     * @returns {Promise<*|null>}
     */
    async login(username) {
        const query = {
            text: `SELECT id, password FROM users WHERE username = $1`,
            values: [username],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Check if username is exists
     *
     * @param username
     * @returns {Promise<boolean>}
     */
    async existsByUsername(username) {
        const query = {
            text: `SELECT id FROM users WHERE username = $1`,
            values: [username],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }

    /**
     * Check if user exists by id
     *
     * @param id
     * @returns {Promise<boolean>}
     */
    async existsById(id) {
        const query = {
            text: `SELECT id FROM users WHERE id = $1`,
            values: [id],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }
}

export default UserRepository;