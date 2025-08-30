import { Pool } from 'pg';

class AlbumRepository {
    constructor() {
        this.connection = new Pool();
    }

    /**
     * Create a new album
     *
     * @param data
     * @returns {Promise<string>}
     */
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

    /**
     * Get album by ID
     *
     * @param id
     * @returns {Promise<*|null>}
     */
    async getById(id) {
        const query = {
            text: `SELECT id, name, year, cover, created_at, updated_at FROM albums WHERE id = $1`,
            values: [id],
        };

        const resultAlbum = await this.connection.query(query);

        if( ! resultAlbum.rows.length ) return null;

        return {
            id: resultAlbum.rows[0].id,
            name: resultAlbum.rows[0].name,
            year: resultAlbum.rows[0].year,
            coverUrl: resultAlbum.rows[0].cover,
            createdAt: resultAlbum.rows[0].created_at,
            updatedAt: resultAlbum.rows[0].updated_at,
            songs: [],
        };
    }

    /**
     * Update existing album by ID
     *
     * @param id
     * @param data
     * @returns {Promise<void>}
     */
    async update(id, data) {
        const query = {
            text: `UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4`,
            values: [data.name, data.year, new Date().toISOString(), id],
        };

        await this.connection.query(query);
    }

    /**
     * Delete existing album
     *
     * @param id
     * @returns {Promise<void>}
     */
    async delete(id) {
        const query = {
            text: `DELETE FROM albums WHERE id = $1`,
            values: [id],
        };

        await this.connection.query(query);
    }

    /**
     * Check if album is exists by ID
     *
     * @param id
     * @returns {Promise<boolean>}
     */
    async existsById(id) {
        const query = {
            text: `SELECT id FROM albums WHERE id = $1`,
            values: [id],
        };

        const result = await this.connection.query(query);
        return result.rows.length > 0;
    }

    /**
     * Update album cover
     *
     * @param id
     * @param coverUrl
     * @returns {Promise<void>}
     */
    async updateCover(id, coverUrl) {
        const query = {
            text: `UPDATE albums SET cover = $1 WHERE id = $2`,
            values: [coverUrl, id],
        };

        await this.connection.query(query);
    }
}

export default AlbumRepository;