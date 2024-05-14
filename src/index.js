import _, { forEach, get } from 'lodash';
import './style.css';
import { Player } from './player';
import { removeCards, showCards, dealerCardHidden, showCardArea, showButtons, hideButtons, updateMessage, hideCardArea } from './components';

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then(response => response.json())
  .then(data => setDeck(data.deck_id));
});

const DEALER_DECISION_DELAY = 1500;
const BACK_CARD = {image: "https://deckofcardsapi.com/static/img/back.png"}

const startGameButton = document.getElementById('startgame');
const hitButton = document.getElementById('hit');
const stayButton = document.getElementById('stay');
const newGameButton = document.getElementById('newgame');

const player = new Player('Player', 0, 0, 0, false);
const dealer = new Player('Dealer', 0, 0, 0, false);

let deckID;

//let playerTurn = true;
let dealerTurn = false;

function setDeck(deckData){
  deckID = deckData;
  return deckID
};

startGameButton.addEventListener('click', () => {
  initializeGame();
  hideButtons(startGameButton);
  showButtons(hitButton, stayButton);
  updateMessage("What would you like to do?");
});

//hit button listener
hitButton.addEventListener('click', () => {
  hitMe();
});

//stay button listener
stayButton.addEventListener('click', () => {
  setFinalScore(player);
  stay();
});

//new game button listener
newGameButton.addEventListener('click', () => {
  resetPlayer(player);
  resetPlayer(dealer);
  hideCardArea();
  initializeGame();
  updateMessage("What would you like to do?");
  hideButtons(newGameButton);
  showButtons(hitButton, stayButton);
});

//setup player and dealer cards
async function initializeGame(){
  await dealCard().then( result => {player.cards.push(result.cards[0])});
  await dealCard().then( result => {dealer.cards.push(result.cards[0])});
  await dealCard().then( result => {player.cards.push(result.cards[0])});
  await dealCard().then( result => {dealer.cards.push(result.cards[0])});

  getScore(player);
  getScore(dealer);

  removeCards(player.name)
  removeCards(dealer.name)
  showCards(player.name, player.cards)
  dealerCardHidden(dealer.cards[0], BACK_CARD)
  showCardArea();
}

//hit me
async function hitMe(){
  await dealCard().then( result => {player.cards.push(result.cards[0])});
  removeCards(player.name)
  showCards(player.name, player.cards)
  getScore(player);
  bustCheck(player);
}

async function stay(){
  dealerTurn = true;
  await dealerStarts();
}

async function dealerStarts(){
  updateMessage('Dealer Starts');
  removeCards(dealer.name)
  showCards(dealer.name, dealer.cards)
  console.log(dealer.cards);
  while(dealerTurn){
    await gameDelay(DEALER_DECISION_DELAY);
    getScore(dealer);
    console.log(dealer);
    if(dealer.highCount <= 16) {
      winCheck();
      updateMessage('Dealer Draws')
      await gameDelay(DEALER_DECISION_DELAY);
      await dealCard().then( result => {dealer.cards.push(result.cards[0])});
      removeCards(dealer.name)
      showCards(dealer.name, dealer.cards)
    } else if (dealer.highCount < 22){
      dealerTurn = false;
      updateMessage('Dealer Stays')
      await gameDelay(DEALER_DECISION_DELAY);
      winCheck();
      return
    } else {
      dealerTurn = false;
      bustCheck(dealer);
      return
    }
  }
}

//deal card logic
async function dealCard(){
  try {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/`);
    const parsedResponse = response.json();
    return parsedResponse;
  } catch(error){
    console.log(error);
  }
};

//check score logic
function getScore(person){
  let lowCount = 0;
  let highCount = 0;
  let oneAce = false;
  for (let i = 0; i < person.cards.length; i++) {
    if(person.cards[i].value === 'JACK' || person.cards[i].value === 'KING' || person.cards[i].value === 'QUEEN') lowCount+=10;
    else if(person.cards[i].value === 'ACE') lowCount += 1;
    else lowCount += Number(person.cards[i].value);
  }
  for (let j = 0; j < person.cards.length; j++) {
    if(person.cards[j].value === 'JACK' || person.cards[j].value === 'KING' || person.cards[j].value === 'QUEEN') highCount+=10;
    else if(person.cards[j].value === 'ACE') {
      if(oneAce) highCount += 1;
      else {
        highCount += 11;
        oneAce = true;
      }
    }
    else highCount += Number(person.cards[j].value);
  }
  person.lowCount = lowCount;
  person.highCount = highCount;
}

//win loss logic
function bustCheck(person){
  if( person.lowCount > 21 ){
    person.bust = true;
    updateMessage(`${person.name} Busts`);
    hideButtons(hitButton, stayButton);
    showButtons(newGameButton);
  }
}

function setFinalScore(person){
  if (person.highCount > 21){
    person.finalScore = person.lowCount;
  } else {
    person.finalScore = person.highCount;
  }
}

function winCheck(){
  if (player.finalScore > dealer.highCount){
    if(dealerTurn === false){
      updateMessage('Player Wins')
      hideButtons(hitButton, stayButton);
      showButtons(newGameButton);
    }
  } else if (player.finalScore < dealer.highCount){
    updateMessage('Dealer Wins')
    dealerTurn = false;
    hideButtons(hitButton, stayButton);
    showButtons(newGameButton);
  } else {
    dealerTurn = false;
    updateMessage('Push')
    hideButtons(hitButton, stayButton);
    showButtons(newGameButton);
  }
}

function resetPlayer(person){
  person.cards.length = 0;
  person.lowCount = 0;
  person.highCount = 0;
  person.finalScore = 0;
  person.bust = false;
}

//game pace
async function gameDelay(delay){
  return new Promise(resolve => {
    setTimeout(() => resolve(), delay);
  });
}