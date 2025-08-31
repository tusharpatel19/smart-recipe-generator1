const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const RECIPES_FILE = path.join(__dirname, 'recipes.json');
const RATINGS_FILE = path.join(__dirname, 'ratings.json');

// --- Helper functions ---
function loadJSON(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let recipes = loadJSON(RECIPES_FILE, []);
let ratings = loadJSON(RATINGS_FILE, {});

// --- APIs ---
app.get('/', (req, res) => res.send('🍳 Smart Recipe API is running. Use /api/recipes'));

app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const r = recipes.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json(r);
});

app.post('/api/recipes/:id/rate', (req, res) => {
  const id = req.params.id;
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be 1-5" });
  }
  if (!ratings[id]) ratings[id] = { sum: 0, count: 0 };
  ratings[id].sum += rating;
  ratings[id].count += 1;
  saveJSON(RATINGS_FILE, ratings);
  res.json({ avg: ratings[id].sum / ratings[id].count });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
