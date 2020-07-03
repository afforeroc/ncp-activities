/* --- PART 1 - Elements and functions that execute once. --- */
const cards = document.querySelectorAll('.memory-card'); // Constant list of all memory-cards.
shuffleCards();

cards.forEach(card => card.addEventListener('click', flipCard)); // Link each memory-card a listen a event.

let hasFlippedCard = false;
let lockBoard = false; // Avoid flip one more pairs of cards.
let firstCard, secondCard;
let numTarget = 6;
let numMatch = 0;

/* --- PART 2 - Functions that execute until the user wins or go out the page. --- */
function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor((Math.random() * 12))
        card.style.order = randomPos;
    });
}

function flipCard(){
    if (lockBoard) return;
    if (this === firstCard) return; // Avoid match because doble click on one card

    this.classList.add('flip'); // Do this in this way: 'memory-card => 'memory-card flip'.
    if (!hasFlippedCard) { // First click.
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // Second click.
    secondCard = this;
    checkForMath();
}

function checkForMath() {
    let isMatch = firstCard.dataset.framework === 
        secondCard.dataset.framework;
    if(isMatch) {
        numMatch += 1;
        soundMatch();
        disableCards();
        if (numMatch === numTarget){
            showFinalMessage();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => { // Wait time 1.5 seconds after last click.
        firstCard.classList.remove('flip'); // Return the selected cards to inicial state.
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() { // Necessary to work fine avoid double click (line 10).
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

/* New functions */
function showFinalMessage() {
    $('#myModalCenter').modal({backdrop: 'static', keyboard: false}); // Show modal and block other interactions around the box  
}

function soundMatch() {
    var audio = new Audio('sounds/sucess.mp3'); // Load sound
    audio.play(); // Play sound
}

function initGame() {
    console.log("restart!");
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    [numMatch, numTarget] = [0, 6];
    cards.forEach(card => card.classList.remove('flip'));
    cards.forEach(card => card.addEventListener('click', flipCard));
    setTimeout(() => {
        shuffleCards();
    }, 1500);
}
