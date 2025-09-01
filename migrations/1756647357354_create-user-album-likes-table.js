/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'varchar(36)',
            primaryKey: true,
            notNull: true,
        },
        album_id: {
            type: 'varchar(50)',
            primaryKey: true,
            notNull: true,
        },
        user_id: {
            type: 'varchar(36)',
            notNull: false,
        },
    }, {
        ifNotExists: true,
    });

    pgm.addConstraint('user_album_likes', 'user_album_likes_album_id_foreign', {
        foreignKeys: {
            columns: 'album_id',
            references: 'albums(id)',
            onDelete: 'CASCADE',
        }
    });

    pgm.addConstraint('user_album_likes', 'user_album_likes_user_id_foreign', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'SET NULL',
        },
    });

    pgm.addIndex('user_album_likes', 'album_id');
    pgm.addIndex('user_album_likes', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('user_album_likes', {
        ifExists: true,
    });
};
