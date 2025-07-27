import { v4 as uuidv4 } from 'uuid';
import AlbumRepository from "../repositories/AlbumRepository.js";
import ResponseException from "../exception/ResponseException.js";

class AlbumService {
    async getById (id) {
        const result = await AlbumRepository.getById(id);

        if( ! result ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        return {
            data: {
                album: result,
            }
        }
     }

     async create (data) {
        data.id = uuidv4();

        const result = await AlbumRepository.create(data);

        return {
            data: {
                albumId: result,
            },
        };
     }

     async update (id, data) {
        const existsById = await AlbumRepository.existsById(id);

        if(!existsById) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await AlbumRepository.update(id, data);

        return {
            message: "Album updated successfully"
        }
     }

     async delete (id) {
        const existsById = await AlbumRepository.existsById(id);

        if( ! existsById ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await AlbumRepository.delete(id);

        return {
            message: "Album deleted successfully"
        }
     }
}

export default new AlbumService;