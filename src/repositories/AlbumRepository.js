import {DatabaseConnection} from "../application/DatabaseConnection.js";

class AlbumRepository {
    constructor() {
        this.table = 'albums';
    }

    async create(data) {
        const query = {
            text: 'INSERT INTO albums (id, title, year) VALUES ($1, $2, $3) RETURNING id',
            values: [data.id, data.title, data.year],
        };

        const result = await DatabaseConnection.query(query);
        return result.rows[0].id;
    }
}

export default new AlbumRepository;