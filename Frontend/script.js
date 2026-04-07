let currentFlashcardIndex = 0;
let usedCardIds = new Set();

function flipCard(card) {
    const question = card.querySelector('.content:not(.hidden)');
    const answer = card.querySelector('.content.hidden');

    if (question) {
        question.classList.add('hidden');
        answer.classList.remove('hidden');
    } else {
        card.remove();

        const cards = document.querySelectorAll('.flashcard');

        if (cards.length > 0) {
            currentFlashcardIndex = 0;
            cards[0].classList.add('active');
        }

        updateCounter(cards.length);
    }
}

function showFlashcard(index) {
    const flashcards = document.querySelectorAll('.flashcard');
    flashcards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
            card.classList.add('active');
        }
    });
}

function nextFlashcard() {
    const cards = document.querySelectorAll('.flashcard');

    if (cards.length <= 1) return;

    const currentCard = cards[currentFlashcardIndex];
    const id = currentCard.dataset.id;

    // mark as used
    usedCardIds.add(Number(id));

    currentCard.remove();

    const remainingCards = document.querySelectorAll('.flashcard');

    if (remainingCards.length === 0) {
        updateCounter(0);
        return;
    }

    currentFlashcardIndex = currentFlashcardIndex % remainingCards.length;
    remainingCards[currentFlashcardIndex].classList.add('active');

    updateCounter(remainingCards.length);
}

function prevFlashcard() {
    const cards = document.querySelectorAll('.flashcard');
    if (cards.length === 0) return;

    cards[currentFlashcardIndex].classList.remove('active');
    currentFlashcardIndex = (currentFlashcardIndex - 1 + cards.length) % cards.length;
    cards[currentFlashcardIndex].classList.add('active');
}

function addFlashcard() {
    const questionInput = document.getElementById('new-question');
    const answerInput = document.getElementById('new-answer');

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    fetch('http://localhost:3000/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer })
    })
    .then(() => {
        loadCards(); // Reload the flashcards
        questionInput.value = ''; // Clear the input fields
        answerInput.value = '';
    })
    .catch(err => console.error("Error adding flashcard:", err));
}

function deleteFlashcard() {
    const cards = document.querySelectorAll('.flashcard');
    const currentCard = cards[currentFlashcardIndex];
    if (!currentCard) return;
    const id = currentCard.dataset.id;

    fetch(`http://localhost:3000/cards/${id}`, {
        method: 'DELETE'
    }).then(() => loadCards());
}

function loadCards() {
    fetch('http://localhost:3000/cards')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('container');
            container.innerHTML = "";
            const filtered = data.filter(card => !usedCardIds.has(card.id));

            filtered.forEach((card, index) => {
                const div = document.createElement('div');
                div.className = 'flashcard';
                div.dataset.id = card.id;

                if (index === 0) div.classList.add('active');
                div.onclick = () => flipCard(div);

                div.innerHTML = `
                    <div class="content">${card.question}</div>
                    <div class="content hidden">${card.answer}</div>
                `;

                container.appendChild(div);
            });

            currentFlashcardIndex = 0;
            updateCounter(filtered.length);
        });
}

function updateCounter(count) {
    document.getElementById('counter').textContent =
        "Total cards: " + count;
}

loadCards();
