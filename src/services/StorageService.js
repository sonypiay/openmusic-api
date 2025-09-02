import StorageHelper from "../helper/StorageHelper.js";
import BadRequestException from "../exception/BadRequestException.js";
import FileUpload from "../helper/FileUpload.js";
import ResponseException from "../exception/ResponseException.js";

class StorageService {
    constructor() {
        this.storageHelper = new StorageHelper;
    }

    /**
     * Upload file
     *
     * @param directory
     * @param file
     * @returns {Promise<{url: (string|null), name: string}>}
     */
    async upload(directory, file) {
        const extensionList = [
            'image/jpeg',
            'image/png',
        ];

        const fileUpload = new FileUpload(file);

        if( ! fileUpload.getFile() ) {
            throw new BadRequestException('File is required');
        }

        if( ! fileUpload.isAllowedMimeType(extensionList) ) {
            throw new BadRequestException('Invalid upload file type. File must be image JPG or PNG');
        }

        if( await fileUpload.isOverSize(512000) ) {
            throw new ResponseException(413, 'fail', 'File size must be less than 500KB');
        }

        const fileHashName = fileUpload.hashName();
        const filePath = `${directory}/${fileHashName}`;

        this.storageHelper.store(directory, fileUpload.getFile(), fileHashName );

        return {
            url: this.storageHelper.url(filePath),
            name: fileHashName,
        };
    }
}

export default StorageService;