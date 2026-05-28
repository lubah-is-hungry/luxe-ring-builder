const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jewelry.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ring_name TEXT NOT NULL,
    material TEXT NOT NULL,
    stone_option TEXT NOT NULL,
    stone_type TEXT,
    ring_size TEXT NOT NULL,
    engraving_text TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    design_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (design_id) REFERENCES designs(id)
  )`);
});

module.exports = db;