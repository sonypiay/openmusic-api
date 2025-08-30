import {Pool} from "pg";

class SongsRepository {
    constructor() {
        this.connection = new Pool();
    }

    /**
     * Store a new song
     *
     * @param data
     * @returns {Promise<string>}
     */
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

    /**
     * Update existing song by ID
     *
     * @param id
     * @param data
     * @returns {Promise<*>}
     */
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
        };

        await this.connection.query(query);
    }

    /**
     * Check if song is exists by ID
     *
     * @param id
     * @returns {Promise<boolean>}
     */
    async existsById(id) {
        const sqlText = `SELECT id FROM songs WHERE id = $1`;
        const query = {
            text: sqlText,
            values: [id],
        };
        const result = await this.connection.query(query);

        return result.rows.length > 0;
    }

    /**
     * Get detail song by ID
     *
     * @param id
     * @returns {Promise<*|null>}
     */
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
        return result.rows[0] ?? null;
    }

    /**
     * Get all songs
     *
     * @param request
     * @returns {Promise<*>}
     */
    async getAll(request) {
        const whereConditions = [];
        const queryValues = [];
        let indexParam = 0;

        if( request ) {
            if( request.title && request.title !== '' ) {
                ++indexParam;
                whereConditions.push(`title ILIKE $${indexParam}`);
                queryValues.push(`%${request.title}%`);
            }

            if( request.performer && request.performer !== '' ) {
                ++indexParam;
                whereConditions.push(`performer ILIKE $${indexParam}`);
                queryValues.push(`%${request.performer}%`);
            }
        }

        const queryWhereConditions = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const sqlText = `SELECT id, title, performer FROM songs ${queryWhereConditions} ORDER BY title DESC`;
        const query = {
            text: sqlText,
            values: queryValues,
        };

        const result = await this.connection.query(query);
        return result.rows;
    }

    /**
     * Delete existing song by ID
     *
     * @param id
     * @returns {Promise<void>}
     */
    async delete(id) {
        const sqlText = `DELETE FROM songs WHERE id = $1`;
        const query = {
            text: sqlText,
            values: [id],
        };

        await this.connection.query(query);
    }

    /**
     * Get song by album ID
     * @param albumId
     * @returns {Promise<number|[]|string[]|ColumnArray[]|number|string|HTMLCollectionOf<HTMLTableRowElement>|SQLResultSetRowList|*>}
     */
    async getSongByAlbumId(albumId) {
        const sqlText = `SELECT songs.id, songs.title, songs.performer FROM songs WHERE songs.album_id = $1`;
        const query = {
            text: sqlText,
            values: [albumId],
        };

        const result = await this.connection.query(query);
        return result.rows;
    }
}

export default SongsRepository;