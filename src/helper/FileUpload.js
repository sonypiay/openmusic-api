import {createWriteStream, existsSync, lstatSync, mkdirSync, unlinkSync} from "node:fs";
import path from "node:path";
import ResponseException from "../exception/ResponseException.js";
import Configuration from "../application/Configuration.js";

class FileUpload {
    constructor(file) {
        this.setFile(file);
        this.rootDirectory = Configuration.storage.local.path;
    }

    setFile(file) {
        this.file = file;
    }

    getFilename() {
        return this.file.hapi.filename;
    }

    getHeaders() {
        return this.file.hapi.headers;
    }

    getMimeType() {
        return this.getHeaders()['content-type'];
    }

    getExtension() {
        return path.extname(this.getFilename());
    }

    getSize() {
        let size = 0;

        return new Promise((resolve, reject) => {
            this.file.on('data', (chunk) => {
                size += chunk.length;
            });

            this.file.on('end', () => {
                resolve(size);
            });

            this.file.on('error', (err) => {
                reject(err);
            });
        });
    }

    isAllowedMimeType(extension = []) {
        if( ! Array.isArray(extension) ) {
            throw new ResponseException(400, 'fail', 'Extension must be string');
        }

        return extension.includes(this.getMimeType());
    }

    async isOverSize(size) {
        return await this.getSize() > size;
    }

    makeDirectory(directory) {
        const directoryPath = path.join(this.rootDirectory, directory);
        const isDirectory = lstatSync(directoryPath).isDirectory();
        if( isDirectory ) return;

        if( ! existsSync(directoryPath) ) {
            mkdirSync(directoryPath, { recursive: true });
        }
    }

    store(directory) {
        this.makeDirectory(directory);
        const directoryPath = path.join(this.rootDirectory, directory);
        const filePath = path.join(directoryPath, this.hashName());
        const fileStream = createWriteStream(filePath);
        this.file.pipe(fileStream);

        return filePath;
    }

    delete(file) {
        const filePath = path.join(this.rootDirectory, file);

        if( this.exists(filePath) ) unlinkSync(filePath);
    }

    exists(file) {
        return existsSync(path.join(this.rootDirectory, file ?? ''));
    }

    hashName() {
        return `${Date.now()}_${this.getFilename()}`;
    }
}

export default FileUpload;