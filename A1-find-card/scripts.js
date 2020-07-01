/* --- PART 1 - Elements and functions that execute once. --- */
const cards = document.querySelectorAll('.memory-card'); // Load a list of all '.memory-card' elements.

(function shuffleCards() { // Asign a unique random number to 12 cards.
    cards.forEach(card => {
        let randomPos = Math.floor((Math.random() * 12));
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', findCard)); // Link each card with 'findCard' funtion.

let [hasFlippedCard, lockBoard] = [false, true]; // Initial conditions

let targetCard;
(function setTargetCard() { // Show the target card to find.
    let randomNum = Math.floor((Math.random() * 12));
    targetCard = cards[randomNum]; // Set a target card to find it.
})();

(function showTargetCard() {
    targetCard.classList.add('flip');
    lockBoard = true;
    setTimeout(() => { // Wait time 1.5 seconds after first flip.
        targetCard.classList.remove('flip'); // Return the target card to inicial state.
        resetBoard();
    }, 1500);
})();

/* --- PART 2 - Functions that execute until the user wins or go out the page. --- */
function findCard(){
    if (lockBoard) return;
    this.classList.add('flip'); // Do this in this way: 'memory-card => 'memory-card flip'.
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        selectedCard = this;
        checkForMatch();
    } 
}

function checkForMatch() {
    let isMatch = targetCard === selectedCard;
    if (isMatch) {
        console.log("You win!!")
    }
    isMatch ? disableAllCards() : hideCard();
}

function disableAllCards() {
    cards.forEach(card => card.removeEventListener('click', findCard));
}

function hideCard() {
    lockBoard = true;
    setTimeout(() => { // Wait time 1.5 seconds after last click.
        selectedCard.classList.remove('flip'); // Return the selected card to inicial state.
        resetBoard();
    }, 1500);
}

function resetBoard() { // Necessary to work fine avoid double click (line 10).
    [hasFlippedCard, lockBoard] = [false, false];
    selectedCard = null;
}
