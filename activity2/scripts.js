/* --- ACTIVITY 2 --- */
/* --- PART 0 - Init --- */
const ROWS = 3;
const COLUMNS = 4;
const cards = document.querySelectorAll('.memory-card'); // Constant list of all memory-cards.
resizeCards(ROWS, COLUMNS); // Edit size of cards.
let numTarget = 6;

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
    cards.forEach(card => card.addEventListener('click', flipCard));
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    numMatch = 0;
    shuffleCards(COLUMNS);
}

function resizeCards(rows, columns) {
    var widthCard = 100 / COLUMNS;
    var heightCard = 100 / ROWS;
    cards.forEach(card => card.style.width = `calc(${widthCard}% - 10px)`);
    cards.forEach(card => card.style.height = `calc(${heightCard}% - 10px)`);
}

function showInitialMessage() {
    $('.modal-title').text('Actividad 2');
    $('.modal-image').attr("src", "images/instructions.svg");
    $('.modal-message').text('Encuentra las cartas que son pareja destapandolas de dos en dos. Tomate tu tiempo, el objetivo es reforzar tu memoria visual realizando el mínimo de pasos posibles para completar esta actividad. ¡Ánimo!');
    $('#myModalCenter').modal({backdrop: 'static', keyboard: false}); // Show modal and block other interactions around the box  
}

function showFinalMessage() {
    $('.modal-title').text('¡Actividad 2: Completa!');
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

function shuffleCards(columns) {
    cards.forEach(card => {
        let randomPos = Math.floor((Math.random() * 12));
        card.style.order = randomPos;
    });
    /*
    let targetSet = [];
    var imagesDir = "images/";
    var ext = ".svg";
    var imagesList = ['books','car','clock','glasses','handbag', 'hat', 'mail', 'palm-tree', 'pencil', 'shoe', 'shop', 'tic-tac-toe'];
    shuffleList(imagesList);
    while (targetSet.length < 12) {
        let image = imagesList.shift();
        var imageFilename = imagesDir + image + ext;
        let randomPos1 = Math.floor((Math.random() * 12));
        let randomPos2 = Math.floor((Math.random() * 12));
        if (randomPos1 != randomPos2 && !targetSet.includes(randomPos1) && !targetSet.includes(randomPos2) && !isAdjacent(randomPos1, randomPos2, columns)) {
            // Part 1
            targetSet.push(randomPos1);
            cards[randomPos1].dataset.framework = image;
            let frontCard1 = cards[randomPos1].querySelector(".front-face");
            frontCard1.src = imageFilename;
            // Part 2
            targetSet.push(randomPos2);
            cards[randomPos2].dataset.framework = image;
            let frontCard2 = cards[randomPos2].querySelector(".front-face");
            frontCard2.src = imageFilename;
        }
    }*/

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

function soundMatch() {
    var audio = new Audio('sounds/sucess.mp3'); // Load sound
    audio.play(); // Play sound
}
