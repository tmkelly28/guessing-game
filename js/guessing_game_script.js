//  ToDo: Submit guesses by pressing Enter

// Declare variables to store each game, the alerts content, and DOM elements
var alertsDisplay = document.getElementById("alerts"),
  alerts = {
    type: ["alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger"],
    exclaim: ["", "Yes! ", "Brr! ", "Yow! ", "Uh oh! ", "Oh noes! ", "Good guess! ", "You could "],
    body: ["", "You got it! It was: ", "Getting colder! Try again! You guessed: ", "Getting hotter! Take another guess! You guessed: ", "You've got one guess left! You guessed: ", "You're out of guesses! The answer was: ", "That's not valid - try guessing a whole number!", "Try guessing between 1 and 100!", "You already guessed ", "Here's a hint: the answer is higher than your guess of ", "Here's a hint: the answer is lower than your guess of ", "try guessing ", "Try starting a new game!"],
    hint: ["", " (Guess higher next time!)", " (Guess lower next time!)"]
  },
  difficultyEasy = document.getElementById("difficulty-easy"),
  difficultyMedium = document.getElementById("difficulty-medium"),
  difficultyHard = document.getElementById("difficulty-hard"),
  hintButton = document.getElementById("hint-button"),
  game,
  guessesRemaining = document.getElementById("guesses-remaining"),
  newAlert,
  submitGuessButton = document.getElementById("submit-guess-button"),
  submitGuessInput = document.getElementById("submit-guess-input");

// Alert object constructor & helper function
function Alert(type, exclaim, body, guess, hint) {
  "use strict";
  this.type = type;
  this.exclaim = exclaim;
  this.body = body;
  this.guess = guess;
  this.hint = hint;
}
Alert.prototype.drawSelf = function () {
  "use strict";
  var divEl = document.createElement("div"),
    strongEl = document.createElement("strong"),
    exclaim = document.createTextNode(this.exclaim),
    body = document.createTextNode(this.body),
    guess = document.createTextNode(this.guess),
    hint = document.createTextNode(this.hint);
  divEl.className = this.type;
  strongEl.appendChild(exclaim);
  divEl.appendChild(strongEl);
  divEl.appendChild(body);
  divEl.appendChild(guess);
  divEl.appendChild(hint);
  alertsDisplay.insertBefore(divEl, alertsDisplay.childNodes[0]);
};
function createAlertObject(v, w, x, y, z) {
  "use strict";
  var newAlert = new Alert(alerts.type[v], alerts.exclaim[w], alerts.body[x], y, alerts.hint[z]);
  newAlert.drawSelf();
}

// Animations
$(document).ready(function () {
  // Alert animation
  $(".make-alerts").click(function () {
    $($("#alerts").children("div")[0]).hide().slideDown();
  });
});

// Game object constructor
function Game(totalGuesses) {
  "use strict";
  this.target = Math.floor((Math.random() * 100) + 1);
  this.lastGuess = null;
  this.pastGuesses = [];
  this.totalGuesses = totalGuesses;
}
Game.prototype.makeGuess = function (guess) {
  "use strict";
  this.totalGuesses -= 1;
  if (guess === this.target) {
    // victory
    newAlert = createAlertObject(0, 1, 1, guess, 0);
    submitGuessInput.setAttribute("disabled", "");
  } else if (this.totalGuesses === 0) {
    // defeat
    newAlert = createAlertObject(3, 5, 5, this.target, 0);
    submitGuessInput.setAttribute("disabled", "");
    guessesRemaining.innerHTML = "--";
  } else if (this.totalGuesses === 1) {
    // warning one guess left!
    newAlert = createAlertObject(3, 4, 4, guess, this.giveHint(guess));
  } else if (this.lastGuess === null) {
    // give a hint for the first guess
    if (this.target > guess) {
      newAlert = createAlertObject(2, 6, 9, guess, 0);
    } else {
      newAlert = createAlertObject(1, 6, 10, guess, 0);
    }
  } else if (Math.abs(this.target - this.lastGuess) > Math.abs(this.target - guess)) {
    // getting warmer
    newAlert = createAlertObject(2, 3, 3, guess, this.giveHint(guess));
  } else {
    // getting colder
    newAlert = createAlertObject(1, 2, 2, guess, this.giveHint(guess));
  }
  guessesRemaining.innerHTML = this.totalGuesses;
  this.lastGuess = guess;
  submitGuessInput.value = "";
};
Game.prototype.giveHint = function (guess) {
  "use strict";
  if (guess > this.target) {
    return 2;
  } else {
    return 1;
  }
};

// Creating a new game
function startNewGame(defaultGuesses) {
  "use strict";
  game = new Game(defaultGuesses);
  alertsDisplay.innerHTML = "";
  guessesRemaining.innerHTML = game.totalGuesses;
  submitGuessInput.removeAttribute("disabled");
}
difficultyEasy.addEventListener("click", function () {
  "use strict";
  startNewGame(14);
});
difficultyMedium.addEventListener("click", function () {
  "use strict";
  startNewGame(7);
});
difficultyHard.addEventListener("click", function () {
  "use strict";
  startNewGame(2);
});

// Validating a guess
submitGuessButton.addEventListener("click", function () {
  "use strict";
  var guess = Number(submitGuessInput.value);
  if (submitGuessInput.hasAttribute("disabled")) {
    // case when new game hasn't been started
    newAlert = createAlertObject(2, 0, 12, "", 0);
  } else if (isNaN(guess)) {
    // case when guess is not a number
    newAlert = createAlertObject(2, 4, 6, "", 0);
  } else if (guess % 1 !== 0) {
    //case when guess is not a whole number
    newAlert = createAlertObject(2, 4, 6, "", 0);
  } else if (guess < 1 || guess > 100) {
    // case when guess is less than 1 or greater than 100
    newAlert = createAlertObject(2, 4, 7, "", 0);
  } else if (game.pastGuesses.indexOf(guess) !== -1) {
    // case when guess has already been guessed
    newAlert = createAlertObject(2, 4, 8, guess, 0);
  } else {
    // case when guess is valid
    game.currentGuess = guess;
    game.makeGuess(game.currentGuess);
    game.pastGuesses.push(guess);
  }
});

// Getting a hint
hintButton.addEventListener("click", function () {
  "use strict";
  if (submitGuessInput.hasAttribute("disabled")) {
    // if no game in progress, the hint is to start a new game :)
    newAlert = createAlertObject(2, 0, 12, "", 0);
  } else {
    // create a alert with a hint
    newAlert = createAlertObject(2, 7, 11, game.target, 0);
  }
});