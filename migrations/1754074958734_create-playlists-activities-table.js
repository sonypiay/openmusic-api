/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('playlists_activities', {
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
        song_id: {
            type: 'varchar(50)',
            notNull: false,
        },
        action: {
            type: 'varchar(255)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });

    pgm.addConstraint('playlists_activities', 'playlists_activities_playlist_id_foreign', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        }
    });

    pgm.addConstraint('playlists_activities', 'playlists_activities_user_id_foreign', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'SET NULL',
        }
    });

    pgm.addConstraint('playlists_activities', 'playlists_activities_song_id_foreign', {
        foreignKeys: {
            columns: 'song_id',
            references: 'songs(id)',
            onDelete: 'SET NULL',
        }
    });

    pgm.addIndex('playlists_activities', 'playlist_id');
    pgm.addIndex('playlists_activities', 'user_id');
    pgm.addIndex('playlists_activities', 'song_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('playlists_activities', {
        ifExists: true,
    });
};
