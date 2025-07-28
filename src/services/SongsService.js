import SongsRepository from "../repositories/SongsRepository.js";
import ResponseException from "../exception/ResponseException.js";

class SongsService
{
    constructor() {
        this.songsRepository = new SongsRepository;
    }

    async getAll() {
        const result = await this.songsRepository.getAll();

        return {
            data: {
                songs: result,
            }
        };
    }

    async getById(id) {
        const result = await this.songsRepository.getById(id);
        if( ! result ) throw new ResponseException(404, 'fail', 'Song not found');

        return {
            data: {
                song: result,
            }
        };
    }

    async create(data) {
        const result = await this.songsRepository.create(data);

        return {
            data: {
                songId: result,
            }
        };
    }

    async update(id, data) {
        const existsById = await this.songsRepository.existsById(id);
        if( ! existsById ) throw new ResponseException(404, 'fail', 'Song not found')

        await this.songsRepository.update(id, data);
    }

    async delete(id) {
        const existsById = await this.songsRepository.existsById(id);
        if( ! existsById ) throw new ResponseException(404, 'fail', 'Song not found')

        await this.songsRepository.delete(id);
    }
}

export default SongsService;