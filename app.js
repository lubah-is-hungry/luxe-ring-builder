const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function validateRing(body) {
  const material = (body.material || '').trim();
  const stoneOption = (body.stoneOption || '').trim();
  const stoneType = (body.stoneType || '').trim();
  const ringSize = (body.ringSize || '').trim();
  const engravingText = (body.engravingText || '').trim();

  if (!material) return 'Material is required.';
  if (!['Yellow Gold', 'White Gold', 'Rose Gold', 'Silver'].includes(material)) return 'Invalid material.';
  if (!['With Stone', 'Without Stone'].includes(stoneOption)) return 'Stone option is required.';
  if (stoneOption === 'With Stone' && !stoneType) return 'Stone type is required when stone is enabled.';
  if (!ringSize) return 'Ring size is required.';
  if (engravingText.length > 25) return 'Engraving must be 25 characters or less.';
  return null;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/designs', (req, res) => {
  db.all('SELECT * FROM designs ORDER BY created_at DESC, id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(rows);
  });
});

app.get('/api/designs/:id', (req, res) => {
  db.get('SELECT * FROM designs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(404).json({ error: 'Design not found.' });
    res.json(row);
  });
});

app.post('/api/designs', (req, res) => {
  const error = validateRing(req.body);
  if (error) return res.status(400).json({ error });

  const { material, stoneOption, stoneType, ringSize, engravingText } = req.body;
  const imageUrl = '/images/ring.png';

  db.run(
    'INSERT INTO designs (ring_name, material, stone_option, stone_type, ring_size, engraving_text, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      'Custom Ring',
      material.trim(),
      stoneOption.trim(),
      stoneOption === 'With Stone' ? stoneType.trim() : null,
      ringSize.trim(),
      engravingText.trim(),
      imageUrl
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database insert failed.' });

      db.get('SELECT * FROM designs WHERE id = ?', [this.lastID], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'Database read failed.' });
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/designs/:id', (req, res) => {
  const error = validateRing(req.body);
  if (error) return res.status(400).json({ error });

  const { material, stoneOption, stoneType, ringSize, engravingText } = req.body;

  db.run(
    'UPDATE designs SET material = ?, stone_option = ?, stone_type = ?, ring_size = ?, engraving_text = ? WHERE id = ?',
    [
      material.trim(),
      stoneOption.trim(),
      stoneOption === 'With Stone' ? stoneType.trim() : null,
      ringSize.trim(),
      engravingText.trim(),
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database update failed.' });
      if (this.changes === 0) return res.status(404).json({ error: 'Design not found.' });

      db.get('SELECT * FROM designs WHERE id = ?', [req.params.id], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'Database read failed.' });
        res.json(row);
      });
    }
  );
});

app.delete('/api/designs/:id', (req, res) => {
  db.run('DELETE FROM designs WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Database delete failed.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Design not found.' });
    res.json({ message: 'Design deleted successfully.' });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));