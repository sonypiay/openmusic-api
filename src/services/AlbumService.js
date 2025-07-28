import { v4 as uuidv4 } from 'uuid';
import AlbumRepository from "../repositories/AlbumRepository.js";
import ResponseException from "../exception/ResponseException.js";

class AlbumService {
    constructor() {
        this.albumRepository = new AlbumRepository;
    }
    
    async getById (id) {
        const result = await this.albumRepository.getById(id);

        if( ! result ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        return {
            data: {
                album: result,
            }
        };
     }

     async create (data) {
        data.id = uuidv4();

        const result = await this.albumRepository.create(data);

        return {
            data: {
                albumId: result,
            },
        };
     }

     async update (id, data) {
        const existsById = await this.albumRepository.existsById(id);

        if(!existsById) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.update(id, data);
     }

     async delete (id) {
        const existsById = await this.albumRepository.existsById(id);

        if( ! existsById ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.delete(id);
     }
}

export default AlbumService;