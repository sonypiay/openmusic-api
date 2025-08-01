/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('collaborations_playlist', {
        id: {
            type: 'varchar(36)',
            primaryKey: true,
            notNull: true,
        },
        playlist_id: {
            type: 'varchar(36)',
            notNull: true,
        },
        user_id: {
            type: 'varchar(36)',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });

    pgm.addConstraint('collaborations_playlist', 'collaborations_playlist_playlist_id_foreign', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        }
    });

    pgm.addConstraint('collaborations_playlist', 'collaborations_playlist_user_id_foreign', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'SET NULL',
        }
    });

    pgm.addIndex('collaborations_playlist', 'playlist_id');
    pgm.addIndex('collaborations_playlist', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('collaborations_playlist', {
        ifExists: true,
    });
};
