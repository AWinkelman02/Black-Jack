// store all functions that deal with DOM elements here

import { forEach } from "lodash";

//create button group

//remove button group

//show cards

//remove cards
const dealerCardBox = document.getElementById('dealercards');
const playerCardBox = document.getElementById('playercards');
const messageBox = document.getElementById('response');

function removeCards(name){
  if(name === 'Player'){
    playerCardBox.innerHTML = '';
  } else {
    dealerCardBox.innerHTML = '';
  }
}

function showCards(name, cards){
  for (let i = 0; i < cards.length; i++) {
    let card = document.createElement('img');
    card.setAttribute('src', `${cards[i].image}`);
    card.classList.add('card');
    if(name === 'Player'){
      playerCardBox.appendChild(card);
    } else {
      dealerCardBox.appendChild(card);
    }
  }
}

function dealerCardHidden(...cards){
  for (let i = 0; i < cards.length; i++) {
    let card = document.createElement('img');
    card.setAttribute('src', `${cards[i].image}`)
    card.classList.add('card');
    dealerCardBox.appendChild(card);
  }
}

function showCardArea(){
  dealerCardBox.classList.remove('hidden');
  playerCardBox.classList.remove('hidden');
}

function hideCardArea(){
  dealerCardBox.classList.add('hidden');
  playerCardBox.classList.add('hidden');
}

function showButtons(...buttons){
  buttons.forEach(button => {
    button.hidden = false;
  });
}

function hideButtons(...buttons){
  buttons.forEach(button => {
    button.hidden = true;
  });
}

function updateMessage(message){
  messageBox.textContent = message;
}

export { removeCards, showCards, dealerCardHidden, showCardArea, showButtons, hideButtons, updateMessage, hideCardArea }