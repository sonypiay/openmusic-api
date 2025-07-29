/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addConstraint('songs', 'songs_album_id_foreign', {
        foreignKeys: {
            columns: 'album_id',
            references: 'albums(id)',
            onDelete: 'SET NULL',
        },
    });

    pgm.addIndex('songs', 'album_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('songs', 'songs_album_id_foreign');
    pgm.dropIndex('songs', 'album_id');
};
