import { Pool } from 'pg';

class AlbumRepository {
    constructor() {
        this.connection = new Pool();
    }

    async create(data) {
        const query = {
            text: `INSERT INTO albums (id, name, year, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            values: [
                data.id,
                data.name,
                data.year,
                new Date().toISOString(),
                new Date().toISOString()
            ],
        };

        const result = await this.connection.query(query);
        return result.rows[0].id;
    }

    async getById(id) {
        const query = {
            text: `SELECT * FROM albums WHERE id = $1`,
            values: [id],
        };

        const querySongs = {
            text: `SELECT id, title, performer FROM songs WHERE album_id = $1`,
            values: [id]
        };

        const result = await this.connection.query(query);

        if( ! result.rows.length ) return null;

        const resultSongs = await this.connection.query(querySongs);

        result.rows[0].songs = resultSongs.rows.length > 0 ? resultSongs.rows : [];
        return result.rows[0];
    }

    async update(id, data) {
        const query = {
            text: `UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4`,
            values: [data.name, data.year, new Date().toISOString(), id],
        };

        const result = await this.connection.query(query);
        return result.rows[0];
    }

    async delete(id) {
        const query = {
            text: `DELETE FROM albums WHERE id = $1`,
            values: [id],
        };

        return await this.connection.query(query);
    }

    async existsById(id) {
        const query = {
            text: `SELECT id FROM albums WHERE id = $1`,
            values: [id],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }
}

export default AlbumRepository;