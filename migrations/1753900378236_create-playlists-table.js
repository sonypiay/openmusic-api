/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'varchar(36)',
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        user_id: {
            type: 'varchar(36)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });

    pgm.addConstraint('playlists', 'playlists_user_id_foreign', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE',
        }
    });

    pgm.addIndex('playlists', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('playlists', {
        ifExists: true,
    });
};
