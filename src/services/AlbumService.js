import { v4 as uuidv4 } from 'uuid';
import AlbumRepository from "../repositories/AlbumRepository.js";
import ResponseException from "../exception/ResponseException.js";
import StorageHelper from "../helper/StorageHelper.js";
import SongsRepository from "../repositories/SongsRepository.js";
import NotFoundException from "../exception/NotFoundException.js";
import StorageService from "./StorageService.js";
import UserAlbumLikesRepository from "../repositories/UserAlbumLikesRepository.js";
import BadRequestException from "../exception/BadRequestException.js";
import RedisConnection from "../application/RedisConnection.js";

class AlbumService {
    constructor() {
        this.albumRepository = new AlbumRepository;
        this.songsRepository = new SongsRepository;
        this.userAlbumLikesRepository = new UserAlbumLikesRepository;
        this.storageHelper = new StorageHelper;
        this.redisConnection = new RedisConnection;
    }

    /**
     * Get album by ID
     * @param id
     * @returns {Promise<{data: {album: *}}>}
     */
    async getById (id) {
        const result = await this.albumRepository.getById(id);

        if( ! result ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        if( result.coverUrl ) {
            result.coverUrl = this.storageHelper.url(`cover/${result.coverUrl}`);
        }

        result.songs = await this.songsRepository.getSongByAlbumId(id);

        return {
            data: {
                album: result,
            },
        };
     }

    /**
     * Create a new album
     *
     * @param data
     * @returns {Promise<{data: {albumId: string}}>}
     */
     async create (data) {
        data.id = uuidv4();

        const result = await this.albumRepository.create(data);

        return {
            data: {
                albumId: result,
            },
        };
     }

    /**
     * Update existing album by ID
     *
     * @param id
     * @param data
     * @returns {Promise<void>}
     */
     async update (id, data) {
        const existsById = await this.albumRepository.existsById(id);

        if(!existsById) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.update(id, data);
     }

    /**
     * Delete existing album by ID
     *
     * @param id
     * @returns {Promise<void>}
     */
     async delete (id) {
        const existsById = await this.albumRepository.existsById(id);

        if( ! existsById ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.delete(id);
     }

    /**
     * Upload cover album
     *
     * @param id
     * @param file
     * @returns {Promise<{url: (string|null), name: string}>}
     */
     async uploadCover(id, file) {
         const getAlbum = await this.albumRepository.getById(id);
         const pathName = `cover`;

         if( ! getAlbum ) {
             throw new NotFoundException('Album not found');
         }

         if( getAlbum.coverUrl ) {
             this.storageHelper.delete(`${pathName}/${getAlbum.coverUrl}`);
         }

         const storageService = new StorageService;
         const dataFile = await storageService.upload(pathName, file);

         await this.albumRepository.updateCover(id, dataFile.name);

         return dataFile;
     }

    /**
     * Add like to album
     *
     * @param albumId
     * @param userId
     * @returns {Promise<void>}
     */
     async addLike(albumId, userId) {
         const albumExists = await this.albumRepository.existsById(albumId);

         if( ! albumExists ) {
             throw new NotFoundException('Album not found');
         }

         const isUserLiked = await this.userAlbumLikesRepository.exists(userId, albumId);

         if( isUserLiked ) {
             throw new BadRequestException('You have already liked this album');
         }

        await this.userAlbumLikesRepository.create(userId, albumId);
     }

    /**
     * Remove like from album
     *
     * @param albumId
     * @param userId
     * @returns {Promise<void>}
     */
     async removeLike(albumId, userId) {
         const albumExists = await this.albumRepository.existsById(albumId);

         if( ! albumExists ) {
             throw new NotFoundException('Album not found');
         }

         await this.userAlbumLikesRepository.delete(userId, albumId);
         const redis = this.redisConnection.init();
         await redis.del(`album:likes:${albumId}`);
     }

    /**
     * Get likes count
     *
     * @param albumId
     * @returns {Promise<{data: {likes: number}}>}
     */
     async getLikesCount(albumId) {
         const albumExists = await this.albumRepository.existsById(albumId);

         if( ! albumExists ) {
             throw new NotFoundException('Album not found');
         }

         const redis = this.redisConnection.init();
         const resultCache = await redis.get(`album:likes:${albumId}`);

         if( resultCache ) {
             return {
                 likes: parseInt(resultCache),
                 isCache: true,
             };
         }

         const result = await this.userAlbumLikesRepository.getLikesCount(albumId);
         await redis.setex(`album:likes:${albumId}`, 1800, result); // cache expired in 30 minutes

         return {
             likes: result,
             isCache: false,
         };
     }
}

export default AlbumService;