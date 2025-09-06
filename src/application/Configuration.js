export default {
    environment: process.env.NODE_ENV,
    application: {
        protocol: process.env.PROTOCOL ?? 'http',
        host: process.env.HOST ?? 'localhost',
        port: process.env.PORT ?? 5000,
    },
    rabbitmq: {
        url: process.env.RABBITMQ_SERVER ?? 'amqp://localhost:5672/',
    },
    jwt: {
        algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
        accessToken: {
            secret: process.env.ACCESS_TOKEN_KEY ?? 'hardcodeajalahpusing',
            expiresIn: process.env.ACCESS_TOKEN_AGE ?? '1h',
        },
        refreshToken: {
            secret: process.env.REFRESH_TOKEN_KEY ?? 'hardcodeajalahpusing',
            expiresIn: process.env.REFRESH_TOKEN_AGE ?? '1h',
        },
    },
    storage: {
        type: process.env.STORAGE_TYPE ?? 'local',
        local: {
            path: process.env.STORAGE_PATH ?? 'storage',
        },
    },
    redis: {
        url: process.env.REDIS_SERVER ?? 'redis://localhost:6379/1',
    },
}