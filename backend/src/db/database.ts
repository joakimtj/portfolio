import Database from 'better-sqlite3'

const db = new Database('projects.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        publishedAt INTEGER NOT NULL,
        isPublic BOOLEAN NOT NULL,
        hasStatus TEXT NOT NULL,
        tags TEXT NOT NULL
    )
`)

export default db