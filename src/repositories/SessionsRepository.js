import { v4 as uuidv4 } from 'uuid';
import { Pool } from "pg";

class SessionsRepository {
    constructor() {
        this.connection = new Pool();
        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt;
    }

    async create(request) {
        const query = {
            text: `INSERT INTO sessions (id, user_id, token, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING token`,
            values: [
                uuidv4(),
                request.user_id,
                request.token,
                this.createdAt,
                this.updatedAt,
            ],
        };

        const result = await this.connection.query(query);
        return result.rows[0];
    }

    async verifyToken(token) {
        const query = {
            text: `SELECT user_id, token FROM sessions WHERE token = $1`,
            values: [token],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    async deleteToken(token) {
        const query = {
            text: `DELETE FROM sessions WHERE token = $1`,
            values: [token],
        };

        await this.connection.query(query);
    }
}

export default SessionsRepository;