let blackjackGame = {
    'you' : {'scoreSpan' : '#your-blackjack-result', 'div':'#your-box', 'score': 0},
    'dealer' : {'scoreSpan' : '#dealer-blackjack-result', 'div':'#dealer-box', 'score': 0},
    'cards' : ['2', '3', '4','5','6','7','8','9','10','J','K','Q','A'],
    'cardsMap' : {'2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, '10' : 10, 'K' : 10, 'J' : 10, 'Q' : 10, 'A' :1},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const CARDS = blackjackGame['cards'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjackHitBtn').addEventListener('click', blackjackHit);
document.querySelector('#blackjackDealBtn').addEventListener('click', dealGame);
document.querySelector('#blackjackStandBtn').addEventListener('click', dealerLogic);

function blackjackHit(){
    if (blackjackGame['isStand'] === false){
    let card=randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    }      
}
function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score']<=21){
        let cardImage = document.createElement('img');
        cardImage.src= `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }}


document.querySelector('#blackjackDealBtn').addEventListener('click', dealGame);

function dealGame() {
    if(blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for(i=0; i<yourImages.length; i++){
            yourImages[i].remove();
        }
        for (k=0; k<dealerImages.length; k++){
            dealerImages[k].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent='0';
        document.querySelector('#your-blackjack-result').style.color='white';
        document.querySelector('#dealer-blackjack-result').textContent='0';
        document.querySelector('#dealer-blackjack-result').style.color='white';
        document.querySelector('#blackjackResult').textContent="Let's play a hand";
        document.querySelector('#blackjackResult').style.color='black';

        blackjackGame['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer) {
   
    activePlayer['score'] += blackjackGame['cardsMap'][card];
}

function showScore(activePlayer){
    if (activePlayer['score'] >21){
        document.querySelector(activePlayer['scoreSpan']).textContent='BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color='red';
    }
    else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;
    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);   
        await sleep(1000);
    }   
    
      
    blackjackGame['turnsOver'] = true;
    showResult(computeWinner());
    
    
}

function computeWinner() {
    let winner;
    if (YOU['score'] <=21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21){            
            winner = YOU;    
            blackjackGame['wins']++;       
        }
        else if (DEALER['score'] > YOU['score']){            
            winner = DEALER; 
            blackjackGame['losses']++;         
        }
        else if (YOU['score'] === DEALER['score']){  
            blackjackGame['draws']++;        
        }
    }
    else if(YOU['score'] >21 && DEALER['score'] <=21){        
        winner = DEALER;  
        blackjackGame['losses']++;     
    }
    else if(YOU['score'] > 21 && DEALER['score'] > 21){    
        blackjackGame['draws']++;    
        
    }

    
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if(blackjackGame['turnsOver'] === true){
        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = "You won ! ";
            messageColor= 'Green';
            winSound.play();
        }
        else if (winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = "You Lost !";
            messageColor ='Red';
            lossSound.play();

        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'Draw match';
            messageColor = 'black';
        }
        document.querySelector('#blackjackResult').textContent=message;
        document.querySelector('#blackjackResult').style.color=messageColor;
    }
}