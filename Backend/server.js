const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

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

// GET
app.get('/cards', (req, res) => {
    db.query('SELECT * FROM flashcards', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// POST
app.post('/cards', (req, res) => {
    const { question, answer } = req.body;

    db.query(
        'INSERT INTO flashcards (question, answer) VALUES (?, ?)',
        [question, answer],
        (err) => {
            if (err) throw err;
            res.json({ message: "Card added" });
        }
    );
});

// DELETE
app.delete('/cards/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM flashcards WHERE id = ?',
        [id],
        (err) => {
            if (err) throw err;
            res.json({ message: "Deleted" });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});