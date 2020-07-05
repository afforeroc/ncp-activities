/* --- ACTIVITY 1 --- */
/* --- PART 0 -  Init --- */
const ROWS = 3;
const COLUMNS = 4;
const cards = document.querySelectorAll('.memory-card'); // Load a list of all '.memory-card' elements.
resizeCards(ROWS, COLUMNS); // Edit size of cards.
const numTarget = COLUMNS;

/* --- PART 1 - This section will executed when the user click on 'Play' button. --- */
let numGames = 0;
showInitialMessage();

/* --- PART 2 - Functions --- */
function initGame() {
    numGames += 1;
    if (numGames == 1) {
        console.log("First game");
    } else {
        console.log(`Game #${numGames}`);
        cards.forEach(card => card.classList.remove('flip'));
    }
    cards.forEach(card => card.addEventListener('click', findCard));
    [hasFlippedCard, lockBoard] = [false, false];
    numMatch = 0;
    targetCards = setTargetCards(ROWS, COLUMNS);
    showTargetCards(targetCards);
    //shuffleCards();
}

function resizeCards(rows, columns) {
    var widthCard = 100 / COLUMNS;
    var heightCard = 100 / ROWS;
    cards.forEach(card => card.style.width = `calc(${widthCard}% - 10px)`);
    cards.forEach(card => card.style.height = `calc(${heightCard}% - 10px)`);
}

function showInitialMessage() {
    $('.modal-title').text('Actividad 1');
    $('.modal-image').attr("src", "images/instructions.svg");
    $('.modal-message').text('Observa detenidamente e intenta memorizar el orden en que se abren las cartas y procede abrirlas una por una. No te preocupes por el tiempo, el objetivo es reforzar tu memoria lógica. ¡Animo!');
    $('#myModalCenter').modal({backdrop: 'static', keyboard: false}); // Show modal and block other interactions around the box  
}

function showFinalMessage() {
    $('.modal-title').text('¡Actividad 1: Completa!');
    $('.modal-image').attr("src", "images/trophy.svg");
    $('.modal-message').text('¡Muy bien! Has completado la actividad. No te preocupes si te tomo algo de tiempo, la idea es que mejores en cada oportunidad. ¿Deseas continuar avanzando o repetir el nivel?');
    $('#myModalCenter').modal({backdrop: 'static', keyboard: false}); // Show modal and block other interactions around the box  
}

function shuffleCards() { // Asign a unique random number to 12 cards.
    cards.forEach(card => {
        let randomPos = Math.floor((Math.random() * 12));
        card.style.order = randomPos;
    });
    cards.forEach(card => card.addEventListener('click', findCard));
}

function findPosMatrix(number, columns) {
    let row = Math.floor(number/columns);
    let col = number - columns*row;
    return [row, col];
}

function isAdjacent(number, columns, targetSet) {
    let boxBase = findPosMatrix(number, columns);
    let item;
    let boxItem = [];
    for (var i = 0; i < targetSet.length; i++) {
        item = targetSet[i];
        boxItem = findPosMatrix(item, columns);
        if (Math.abs(boxBase[0] - boxItem[0]) == 1 && Math.abs(boxBase[1] - boxItem[1]) == 1) {
            return 0; //Allowed: Diagonal
        }
        if (Math.abs(boxBase[0] - boxItem[0]) == 1 && Math.abs(boxBase[1] - boxItem[1]) != 1) {
            return 1; // Prohibited: Up or down
        }
        if (Math.abs(boxBase[0] - boxItem[0]) != 1 && Math.abs(boxBase[1] - boxItem[1]) == 1) {
            return 1; // Prohibited: Left or right
        }
    }
    return 0;
}

function setTargetCards(rows, columns) { // Establish the target cards to find.
    let numCards = rows*columns;
    var box = [];
    let targetSet = [];
    let targetCards = [];
    let randomPos;
    i = 0;
    while (i < numTarget) {
        randomPos = Math.floor((Math.random() * 12));
        if(!targetSet.includes(randomPos) && !isAdjacent(randomPos, columns, targetSet)){
            targetSet.push(randomPos);
            targetCards.push(cards[randomPos]);
            i += 1;   
        }
    }
    return targetCards;
}

// Show a card
function showCard(card) {
    lockBoard = true;
    return new Promise(function(resolve, reject){
        setTimeout(function() {
            card.classList.add('flip');
            setTimeout(() => { card.classList.remove('flip');
            }, 1000);
            blockBoard();
            resolve(card);
        }, 1500)
    })
}

// Show all cards in sequence
async function showTargetCards(targetCards) {
    $('.memory-game').css('pointer-events', 'none');
    for(let i = 0; i < targetCards.length; i++){
        await showCard(targetCards[i]);
    }
    setTimeout(() => { $('.memory-game').css('pointer-events', 'auto');
    }, 2000);
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
    let isMatch = (targetCards[0] === selectedCard);
    if (isMatch) {
        targetCards.shift();
        numMatch += 1;
        soundMatch();
        disableCard();
        if (numMatch === numTarget){
            disableAllCards();
        }
        else {
            blockBoard();
        }
    }
    else {
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

function soundMatch() {
    var audio = new Audio('sounds/sucess.mp3'); // Load sound
    audio.play(); // Play sound
}