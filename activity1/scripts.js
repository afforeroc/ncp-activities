/* --- PART 1 - Elements and functions that execute once. --- */
const cards = document.querySelectorAll('.memory-card'); // Load a list of all '.memory-card' elements.

/* --- Edit CSS --- */
let hCards = 4;
let vCards = 3;
(function resizeCards() {
    console.log('resizeCards');
    var widthCard = 100 / hCards;
    var heightCard = 100 / vCards;
    cards.forEach(card => card.style.width = `calc(${widthCard}% - 10px)`);
    cards.forEach(card => card.style.height = `calc(${heightCard}% - 10px)`);
})();

shuffleCards();

cards.forEach(card => card.addEventListener('click', findCard)); // Link each card with 'findCard' funtion.

let [hasFlippedCard, lockBoard] = [false, true]; // Initial conditions

let numTarget = 3;
let randomPosSet = []
let targetCards = [];
let numMatch = 0;

setTargetCards();
showTargetCards();

/* --- PART 2 - Functions that execute until the user wins or go out the page. --- */
function shuffleCards() { // Asign a unique random number to 12 cards.
    cards.forEach(card => {
        let randomPos = Math.floor((Math.random() * 12));
        card.style.order = randomPos;
    });
}

function setTargetCards() { // Establish the target cards to find.
    i = 0;
    while (i < numTarget) {
        let randomPos = Math.floor((Math.random() * 12));
        if(!randomPosSet.includes(randomPos)){
            i += 1;
            randomPosSet.push(randomPos);
            let randomCard = cards[randomPos]; // Set a random card.
            targetCards.push(randomCard);
        }   
    }
    console.log(targetCards.length)
}

function showTargetCards() {
    targetCards.forEach(card => card.classList.add('flip'));
    lockBoard = true;
    setTimeout(() => { // Wait time 1.5 seconds after first flip.
        targetCards.forEach(card => card.classList.remove('flip')); // Return the target card to inicial state.
        blockBoard();
    }, 1500);
}

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
    console.log("checkForMatch");
    console.log(selectedCard);
    let isMatch = targetCards.includes(selectedCard);
    if (isMatch) {
        numMatch += 1;
        console.log("One match!")
        soundMatch();
        disableCard();
        if (numMatch === numTarget){
            console.log("disableAllCards!")
            disableAllCards();
        }
        else {
            console.log("blockBoard")
            blockBoard();
        }
    }
    else {
        console.log("hideCard!")
        hideCard();
    }

}

function disableCard() {
    selectedCard.removeEventListener('click', findCard);
    blockBoard();
}

function disableAllCards() {
    cards.forEach(card => card.removeEventListener('click', findCard));
    showFinalMessage();
}

function hideCard() {
    lockBoard = true;
    setTimeout(() => { // Wait time 1.5 seconds after last click.
        selectedCard.classList.remove('flip'); // Return the selected card to inicial state.
        blockBoard();
    }, 1500);
}

function blockBoard() { // Necessary to work fine avoid double click (line 10).
    [hasFlippedCard, lockBoard] = [false, false];
    selectedCard = null;
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
    cards.forEach(card => card.classList.remove('flip'));
    cards.forEach(card => card.addEventListener('click', findCard));
    setTimeout(() => {
        shuffleCards();
    }, 1500);
    numTarget = 3;
    numMatch = 0;
    randomPosSet = []
    targetCards = [];
    setTargetCards();
    setTimeout(() => {
        showTargetCards();
    }, 1500);
    
}