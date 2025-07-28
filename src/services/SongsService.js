import SongsRepository from "../repositories/SongsRepository.js";
import ResponseException from "../exception/ResponseException.js";

class SongsService
{
    constructor() {
        this.songsRepository = new SongsRepository;
    }

    /**
     * Get list of songs
     *
     * @param request
     * @returns {Promise<{data: {songs: *}>}
     */
    async getAll(request) {
        const result = await this.songsRepository.getAll(request.query);

        return {
            data: {
                songs: result,
            }
        };
    }

    /**
     * Get songs by ID
     *
     * @param id
     * @returns {Promise<{data: {song: *}}>}
     */
    async getById(id) {
        const result = await this.songsRepository.getById(id);
        if( ! result ) throw new ResponseException(404, 'fail', 'Song not found');

        return {
            data: {
                song: result,
            }
        };
    }

    /**
     * Create a new song
     * @param data
     * @returns {Promise<{data: {songId: string}}>}
     */
    async create(data) {
        const result = await this.songsRepository.create(data);

        return {
            data: {
                songId: result,
            }
        };
    }

    /**
     * Update existsing song
     *
     * @param id
     * @param data
     * @returns {Promise<void>}
     */
    async update(id, data) {
        const existsById = await this.songsRepository.existsById(id);
        if( ! existsById ) throw new ResponseException(404, 'fail', 'Song not found')

        await this.songsRepository.update(id, data);
    }

    /**
     * Delete existing song
     *
     * @param id
     * @returns {Promise<void>}
     */
    async delete(id) {
        const existsById = await this.songsRepository.existsById(id);
        if( ! existsById ) throw new ResponseException(404, 'fail', 'Song not found')

        await this.songsRepository.delete(id);
    }
}

export default SongsService;