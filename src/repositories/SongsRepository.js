import {Pool} from "pg";

class SongsRepository {
    constructor() {
        this.connection = new Pool();
    }

    async create(data) {
        const sqlText = `
            INSERT INTO songs (
                id, 
                title, 
                year,
                genre, 
                performer,
                duration,
                album_id,
                created_at,
                updated_At
            ) 
            VALUES (
                $1, 
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            ) RETURNING id`;
        const query = {
            text: sqlText,
            values: [
                data.id,
                data.title,
                data.year,
                data.genre,
                data.performer,
                data.duration,
                data.albumId ?? null,
                new Date().toISOString(),
                new Date().toISOString()
            ],
        }

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    async update(id, data) {
        const sqlText = `
            UPDATE songs SET
                title = $1,
                year = $2,
                genre = $3,
                performer = $4,
                duration = $5,
                album_id = $6,
                updated_at = $7
            WHERE id = $8`;

        const query = {
            text: sqlText,
            values: [
                data.title,
                data.year,
                data.genre,
                data.performer,
                data.duration,
                data.albumId ?? null,
                new Date().toISOString(),
                id
            ],
        }

        const result = await this.connection.query(query);
        return result.rows[0];
    }

    async existsById(id) {
        const sqlText = `SELECT id FROM songs WHERE id = $1`;
        const query = {
            text: sqlText,
            values: [id],
        };
        const result = await this.connection.query(query);

        return result.rows.length > 0;
    }

    async getById(id) {
        const sqlText = `
        SELECT
            songs.id,
            songs.title,
            songs.year,
            songs.genre,
            songs.performer,
            songs.duration,
            songs.album_id as albumId
        FROM songs
        WHERE songs.id = $1`;

        const query = {
            text: sqlText,
            values: [id],
        };

        const result = await this.connection.query(query);
        return result.rows[0];
    }

    async getAll() {
        const sqlText = `SELECT id, title, performer FROM songs ORDER BY title DESC`;
        const query = {
            text: sqlText,
        };

        const result = await this.connection.query(query);
        return result.rows;
    }

    async delete(id) {
        const sqlText = `DELETE FROM songs WHERE id = $1`;
        const query = {
            text: sqlText,
            values: [id],
        };

        await this.connection.query(query);
    }
}

export default SongsRepository;