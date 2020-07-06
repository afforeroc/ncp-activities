/* --- ACTIVITY 1 --- */
/* --- PART 0 -  Init --- */
const ROWS = 3;
const COLUMNS = 4;
const cards = document.querySelectorAll('.memory-card'); // Load a list of all '.memory-card' elements.
resizeCards(ROWS, COLUMNS); // Edit size of cards.
let numTarget;

/* --- PART 1 - This section will executed when the user click on 'Play' button. --- */
let numGames = 0;
showInitialMessage();

/* --- PART 2 - Functions --- */
function initGame() {
    numGames += 1;
    console.log(`Game #${numGames}`);
    numTarget = Math.floor((Math.random() * (7 - 4 + 1) + 4)); // For 12 cards, in sequence: max 9, min 4.
    console.log(`${numTarget} cards to find`);
    cards.forEach(card => card.classList.remove('flip')); // Only have effect after first game
    cards.forEach(card => card.addEventListener('click', findCard));
    [hasFlippedCard, lockBoard] = [false, false];
    numMatch = 0;
    targetCards = setTargetCards(COLUMNS);
    shuffleCards();
    showTargetCards(targetCards);  
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

function shuffleList(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function shuffleCards() { // Asign a unique random number to 12 cards.
    const frontCards = document.querySelectorAll('.front-face'); // Load a list of all '.memory-card' elements.
    var imagesDir = "images/";
    var imagesList = ['books.svg','car.svg','clock.svg','glasses.svg','handbag.svg', 'hat.svg', 'mail.svg', 'palm-tree.svg', 'pencil.svg', 'shoe.svg', 'shop.svg', 'tic-tac-toe.svg'];
    shuffleList(imagesList);
    for (var i = frontCards.length; i--;) {
        var imageFilename = imagesDir + imagesList[i];
        frontCards[i].src = imageFilename;
    }
}

function findPosMatrix(position, columns) {
    let row = Math.floor(position/columns);
    let col = position - columns*row;
    return [row, col];
}

function isAdjacent(possiblePos, lastPos, columns) {
    let possibleBox = findPosMatrix(possiblePos, columns);
    let lastBox = findPosMatrix(lastPos, columns);
    if (Math.abs(possibleBox[0] - lastBox[0]) == 1 && Math.abs(possibleBox[1] - lastBox[1]) == 1) {
        return 0; //Allowed: Diagonal
    }
    else if (Math.abs(possibleBox[0] - lastBox[0]) == 1 && Math.abs(possibleBox[1] - lastBox[1]) != 1) {
        return 1; // Prohibited: Up or down
    }
    else if (Math.abs(possibleBox[0] - lastBox[0]) != 1 && Math.abs(possibleBox[1] - lastBox[1]) == 1) {
        return 1; // Prohibited: Left or right
    }
    return 0;
}

function setTargetCards(columns) { // Establish the target cards to find.
    let possiblePos;
    let lastPos;
    let targetSet = [];
    let targetCards = [];
    i = 0;
    while (i < numTarget) {
        possiblePos = Math.floor((Math.random() * 12));
        if (!targetSet.length) { // For first element
            targetSet.push(possiblePos);
            targetCards.push(cards[possiblePos]);
            i += 1;
        }
        else { // For second to final element
            lastPos = targetSet[targetSet.length - 1];
            if (!targetSet.includes(possiblePos) && !isAdjacent(possiblePos, lastPos, columns)){
                targetSet.push(possiblePos);
                targetCards.push(cards[possiblePos]);
                i += 1;
            } 
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