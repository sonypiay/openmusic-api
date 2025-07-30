/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('playlists_song', {
        id: {
            type: 'varchar(36)',
            primaryKey: true,
            notNull: true,
        },
        playlist_id: {
            type: 'varchar(36)',
            notNull: true,
        },
        song_id: {
            type: 'varchar(50)',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });

    pgm.addConstraint('playlists_song', 'playlists_song_playlist_id_foreign', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        }
    });

    pgm.addConstraint('playlists_song', 'playlists_song_song_id_foreign', {
        foreignKeys: {
            columns: 'song_id',
            references: 'songs(id)',
            onDelete: 'SET NULL',
        },
    });

    pgm.addIndex('playlists_song', 'playlist_id');
    pgm.addIndex('playlists_song', 'song_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('playlists_song', {
        ifExists: true,
    });
};
