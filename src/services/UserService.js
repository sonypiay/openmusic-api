import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository.js";
import BadRequestException from "../exception/BadRequestException.js";

class UserService {
    constructor() {
        this.userRepository = new UserRepository;
    }

    async create(request) {
        const existsByUsername = await this.userRepository.existsByUsername(request.username);

        if( existsByUsername ) throw new BadRequestException('Username already exists');

        request.password = await bcrypt.hash(request.password, 10);

        return {
            data: {
                userId: await this.userRepository.create(request)
            },
        };
    }
}

export default UserService;