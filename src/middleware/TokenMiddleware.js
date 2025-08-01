import UnauthorizedException from "../exception/UnauthorizedException.js";
import TokenHelper from "../helper/TokenHelper.js";
import UserRepository from "../repositories/UserRepository.js";

const TokenMiddleware = () => {
    return {
        authenticate: async (request, response) => {
            const authorization = request.headers.authorization ?? '';

            if( authorization === '' ) {
                throw new UnauthorizedException('Unauthorized');
            }

            const token = authorization.replace('Bearer ', '');
            const tokenHelper = new TokenHelper;

            try {
                const userToken = tokenHelper.verifyToken(token, 'access');
                const userRepository = new UserRepository;
                const users = await userRepository.getById(userToken.user_id);

                return response.authenticated({
                    credentials: {
                        user_id: users.id,
                        username: users.username,
                        fullname: users.fullname,
                    },
                });
            } catch (error) {
                throw new UnauthorizedException(error.message);
            }
        }
    }
};

export default TokenMiddleware;