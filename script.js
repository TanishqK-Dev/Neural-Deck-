let cards = JSON.parse(localStorage.getItem('neural-cards')) || [];
let currentCardIndex = 0;
let activeFilter = "all";

const flashcard = document.getElementById('flashcard');
const frontText = document.getElementById('front-text');
const backText = document.getElementById('back-text');
const progress = document.getElementById('progress');
const filterSelect = document.getElementById('filter-subject');

function updateDropdown() {
    const subjects = [...new Set(cards.map(c => c.subject))];
    filterSelect.innerHTML = '<option value="all">All Subjects</option>';
    subjects.forEach(sub => {
        if(sub) filterSelect.innerHTML += `<option value="${sub}">${sub}</option>`;
    });
    filterSelect.value = activeFilter;
}

function updateUI() {
    const filteredCards = activeFilter === "all" ? cards : cards.filter(c => c.subject === activeFilter);

    if (filteredCards.length > 0) {
        if (currentCardIndex >= filteredCards.length) currentCardIndex = 0;
        const currentCard = filteredCards[currentCardIndex];
        frontText.innerText = currentCard.question;
        backText.innerText = currentCard.answer;
        document.getElementById('current-index').innerText = currentCardIndex + 1;
        document.getElementById('total-cards').innerText = filteredCards.length;
        progress.style.width = `${((currentCardIndex + 1) / filteredCards.length) * 100}%`;
    } else {
        frontText.innerText = "Deck is empty!";
        backText.innerText = "Add a card below.";
        document.getElementById('current-index').innerText = "0";
        document.getElementById('total-cards').innerText = "0";
        progress.style.width = "0%";
    }
    flashcard.classList.remove('flipped');
}

// AI Generation Feature
document.getElementById('generate-btn').addEventListener('click', () => {
    const topic = document.getElementById('ai-topic').value.trim();

    if (!topic) {
        alert("Please enter a topic to generate cards.");
        return;
    }

    // Mock response objects to test behavior without a server key
    const mockAICards = [
        {
            subject: topic,
            question: `What is the core definition of ${topic}?`,
            answer: `It represents a core concept related to software, theory, and implementation.`
        },
        {
            subject: topic,
            question: `What are the benefits of ${topic}?`,
            answer: `Improves performance, modularity, and structure.`
        },
        {
            subject: topic,
            question: `What is the relationship between ${topic} and the application?`,
            answer: `It serves as an important architectural element.`
        }
    ];

    // Append to array
    mockAICards.forEach(c => cards.push(c));
    localStorage.setItem('neural-cards', JSON.stringify(cards));

    // Reset input and update UI
    document.getElementById('ai-topic').value = '';
    updateDropdown();
    updateUI();
    alert(`AI generated three flashcards for ${topic}!`);
});

// Event Listeners
document.getElementById('add-card').addEventListener('click', () => {
    const s = document.getElementById('subject').value.trim();
    const q = document.getElementById('question').value.trim();
    const a = document.getElementById('answer').value.trim();
    if (q && a && s) {
        cards.push({ subject: s, question: q, answer: a });
        localStorage.setItem('neural-cards', JSON.stringify(cards));
        document.getElementById('subject').value = '';
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        updateDropdown();
        updateUI();
    }
});

document.getElementById('flip-btn').addEventListener('click', () => flashcard.classList.toggle('flipped'));

document.getElementById('next-btn').addEventListener('click', () => {
    const filteredCards = activeFilter === "all" ? cards : cards.filter(c => c.subject === activeFilter);
    if (currentCardIndex < filteredCards.length - 1) {
        currentCardIndex++;
        updateUI();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateUI();
    }
});

document.getElementById('delete-card').addEventListener('click', (e) => {
    e.stopPropagation();
    const filteredCards = activeFilter === "all" ? cards : cards.filter(c => c.subject === activeFilter);
    if (filteredCards.length === 0) return;

    if (confirm("Delete this card?")) {
        const cardToDelete = filteredCards[currentCardIndex];
        const masterIndex = cards.indexOf(cardToDelete);
        if (masterIndex > -1) {
            cards.splice(masterIndex, 1);
            localStorage.setItem('neural-cards', JSON.stringify(cards));
            if (currentCardIndex >= filteredCards.length - 1 && currentCardIndex > 0) currentCardIndex--;
            updateDropdown();
            updateUI();
        }
    }
});

document.getElementById('clear-deck').addEventListener('click', () => {
    if(confirm("Delete EVERYTHING?")) {
        cards = [];
        localStorage.clear();
        updateDropdown();
        updateUI();
    }
});

filterSelect.addEventListener('change', (e) => {
    activeFilter = e.target.value;
    currentCardIndex = 0;
    updateUI();
});

// Init
updateDropdown();
updateUI();
