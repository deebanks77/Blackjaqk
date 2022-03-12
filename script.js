// Add event listner
document.querySelector("#blackjack-rules").addEventListener("click", rulesBtn);
document.querySelector(".exit-rules").addEventListener("click", exitRulesBtn);
document
  .querySelector("#blackjack-hit")
  .addEventListener("click", blackjackHitBtn);
document
  .querySelector("#blackjack-stand")
  .addEventListener("click", blackjackStandBtn);
document
  .querySelector("#blackjack-deal")
  .addEventListener("click", blackjackDealBtn);

//   Blackjack Data
const blackjackData = {
  cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, "K", "Q", "J", "A"],
  cardsInfo: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  you: {
    cardsContainer: "#your-box",
    resultContainer: "#your-blackjack-result",
    score: 0,
  },

  dealer: {
    cardsContainer: "#dealer-box",
    resultContainer: "#dealer-blackjack-result",
    score: 0,
  },

  result: "#blackjack-result",

  wins: 0,
  losses: 0,
  draws: 0,
  isHit: true,
  isStand: false,
  turnsOver: false,
};

const You = blackjackData["you"];
const Dealer = blackjackData["dealer"];

// Game sounds
const hitSound = new Audio("sounds/swish.m4a");
const looseSound = new Audio("sounds/aww.mp3");
const winSound = new Audio("sounds/cash.mp3");

// Blackjack rules Callback
function rulesBtn() {
  document.querySelector(".rules").style.display = "block";
}

// Blackjack exit-rules callback
function exitRulesBtn() {
  document.querySelector(".rules").style.display = "none";
}

// Blackjack Hit Callback
function blackjackHitBtn(event) {
  // initial state of the game

  if (blackjackData["isHit"] === true) {
    // random card function
    let card = randomCard();
    // show player cards
    showCards(You, card);
    // calculate the score
    calculateScore(You, card);
    //   update the score on UI
    UpdateUIscore(You);
    // isStand should be true now
    blackjackData["isStand"] = true;
  }
}

// sleep function for dealer
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Blackjack Stand Callback
async function blackjackStandBtn() {
  if (blackjackData["isStand"] === true) {
    while (Dealer["score"] <= 16) {
      // random card function
      let card = randomCard();
      // show Dealer cards
      showCards(Dealer, card);
      // calculate the score
      calculateScore(Dealer, card);
      // update the score on UI
      UpdateUIscore(Dealer);
      //   sleep function
      await sleep(1000);
    }
    if (Dealer["score"] > 15) {
      // compute winner
      let winner = computeWinner();

      // determine the winner
      showResult(winner);
      // turnsOver is true
      blackjackData["isHit"] = false;
      blackjackData["turnsOver"] = true;
      blackjackData["isStand"] = false;
    }
  }
}

// Blackjack Deal Callback
function blackjackDealBtn() {
  if (blackjackData["turnsOver"] === true) {
    // clear card fields
    clearFields();
    // determin winner
    blackjackData["isHit"] = true;
  }
}

// random card generator
function randomCard() {
  let random, randCard;
  random = Math.floor(Math.random() * 13);
  randCard = [2, 3, 4, 5, 6, 7, 8, 9, 10, "K", "Q", "J", "A"][random];
  return randCard;
}

// Show card function
function showCards(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    let cardsImage = document.createElement("img");
    cardsImage.setAttribute("src", `images/${card}.png`);
    document
      .querySelector(activePlayer["cardsContainer"])
      .appendChild(cardsImage);
    hitSound.play();
  }
}

// Calculate score and update database
function calculateScore(activePlayer, card) {
  if (card === "A") {
    if (activePlayer["score"] + blackjackData["cardsInfo"][card][1] <= 21) {
      activePlayer["score"] += blackjackData["cardsInfo"][card][1];
    } else if (
      activePlayer["score"] + blackjackData["cardsInfo"][card][1] >
      21
    ) {
      activePlayer["score"] += blackjackData["cardsInfo"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackData["cardsInfo"][card];
  }
  //   let score = blackjackData["cardsInfo"][card];
  //   console.log(score);
}

// Update active player score on UI
function UpdateUIscore(activePlayer) {
  if (activePlayer["score"] <= 21) {
    document.querySelector(activePlayer["resultContainer"]).textContent =
      activePlayer["score"];
  } else {
    document.querySelector(activePlayer["resultContainer"]).textContent =
      "Bust!";
    document.querySelector(activePlayer["resultContainer"]).style.color = "red";
  }
}

// compute winner and return who won
function computeWinner() {
  let winner;
  if (You["score"] <= 21) {
    //   condition: higher score than dealer or when dealer burst and you did not
    if (You["score"] > Dealer["score"] || Dealer["score"] > 21) {
      blackjackData["wins"]++;
      winner = You;
    } else if (You["score"] < Dealer["score"]) {
      blackjackData["losses"]++;
      winner = Dealer;
    } else if (You["score"] === Dealer["score"]) {
      blackjackData["draws"]++;
    }
    // condition: when you burst and dealer doesnt
  } else if (You["score"] > 21 && Dealer["score"] <= 21) {
    blackjackData["losses"]++;
    winner = Dealer;
    // condition when you and dealer burst
  } else if (You["score"] > 21 && Dealer["score"] > 21) {
    blackjackData["draws"]++;
  }

  return winner;
}

// clear fields to play new game
function clearFields() {
  let images = document.querySelectorAll("img");

  images.forEach((image) => {
    image.remove();
  });

  You["score"] = 0;
  Dealer["score"] = 0;

  document.querySelector("#your-blackjack-result").textContent = 0;
  document.querySelector("#dealer-blackjack-result").textContent = 0;

  document.querySelector("#your-blackjack-result").style.color = "aqua";
  document.querySelector("#dealer-blackjack-result").style.color = "aqua";

  document.querySelector("#blackjack-result").textContent = "Let's play";
  document.querySelector("#blackjack-result").style.color = "aqua";
}

// show final result
function showResult(winner) {
  let message, messageColor;
  if (winner === You) {
    document.querySelector("#wins").textContent = blackjackData["wins"];
    message = "You won!";
    messageColor = "gold";
    winSound.play();
  } else if (winner === Dealer) {
    document.querySelector("#losses").textContent = blackjackData["losses"];
    message = "You lost!";
    messageColor = "red";
    looseSound.play();
  } else {
    document.querySelector("#draws").textContent = blackjackData["draws"];
    message = "You tied!";
    messageColor = "aqua";
  }

  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messageColor;
}
