const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Passionfruit420',
    database: 'flashcard_app'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary storage (we’ll replace with database later)
let flashcards = [];

// GET all cards
app.get('/cards', (req, res) => {
    res.json(flashcards);
});

// ADD a card
app.post('/cards', (req, res) => {
    const { question, answer } = req.body;

    db.query(
        'INSERT INTO flashcards (question, answer) VALUES (?, ?)',
        [question, answer],
        (err, result) => {
            if (err) throw err;
            res.json({ message: "Card added" });
        }
    );
});

// DELETE a card
app.delete('/cards/:index', (req, res) => {
    const index = req.params.index;
    flashcards.splice(index, 1);
    res.json({ message: "Card deleted!" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});