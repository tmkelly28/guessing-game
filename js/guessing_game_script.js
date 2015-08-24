//  ToDo: Refactor functions so that game does not need to be a global variable
//  ToDo: If submitGuessInput has focus, Enter should submit
//  ToDo: Another animation for victory/failure

// Declare variables to store each game, the alerts content
var alerts = {
    type: ["alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger"],
    exclaim: ["", "Yes! ", "Brr! ", "Yow! ", "Uh oh! ", "Oh noes! ", "Good guess! ", "You could "],
    body: ["", "You got it! It was: ", "Getting colder! Try again! You guessed: ", "Getting hotter! Take another guess! You guessed: ", "You've got one guess left! You guessed: ", "You're out of guesses! The answer was: ", "That's not valid - try guessing a whole number!", "Try guessing between 1 and 100!", "You already guessed ", "Here's a hint: the answer is higher than your guess of ", "Here's a hint: the answer is lower than your guess of ", "try guessing ", "Try starting a new game!"],
    hint: ["", " (Guess higher next time!)", " (Guess lower next time!)"]
  };

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
  $("#alerts").prepend(divEl);
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
    createAlertObject(0, 1, 1, guess, 0);
    $("#submit-guess-input").attr("disabled", "");
  } else if (this.totalGuesses === 0) {
    // defeat
    createAlertObject(3, 5, 5, this.target, 0);
    $("#submit-guess-input").attr("disabled", "");
    $("#guesses-remaining").html("--");
  } else if (this.totalGuesses === 1) {
    // warning one guess left!
    createAlertObject(3, 4, 4, guess, this.giveHint(guess));
  } else if (this.lastGuess === null) {
    // give a hint for the first guess
    if (this.target > guess) {
      createAlertObject(2, 6, 9, guess, 0);
    } else {
      createAlertObject(1, 6, 10, guess, 0);
    }
  } else if (Math.abs(this.target - this.lastGuess) > Math.abs(this.target - guess)) {
    // getting warmer
    createAlertObject(2, 3, 3, guess, this.giveHint(guess));
  } else {
    // getting colder
    createAlertObject(1, 2, 2, guess, this.giveHint(guess));
  }
  $("#guesses-remaining").html(this.totalGuesses);
  this.lastGuess = guess;
  $("#submit-guess-input").val("");
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
  var game = new Game(defaultGuesses);
  $("#alerts").html("");
  $("#guesses-remaining").html(game.totalGuesses);
  $("#submit-guess-input").removeAttr("disabled");
}
$("#difficulty-easy").click(function () {
  "use strict";
  startNewGame(14);
});
$("#difficulty-medium").click(function () {
  "use strict";
  startNewGame(7);
});
$("#difficulty-hard").click(function () {
  "use strict";
  startNewGame(2);
});

// Validating a guess
$("#submit-guess-button").click(function () {
  "use strict";
  var guess = Number($("#submit-guess-input").val());
  if ($("#submit-guess-input").attr("disabled")) {
    // case when new game hasn't been started
    createAlertObject(2, 0, 12, "", 0);
  } else if (isNaN(guess)) {
    // case when guess is not a number
    createAlertObject(2, 4, 6, "", 0);
  } else if (guess % 1 !== 0) {
    //case when guess is not a whole number
    createAlertObject(2, 4, 6, "", 0);
  } else if (guess < 1 || guess > 100) {
    // case when guess is less than 1 or greater than 100
    createAlertObject(2, 4, 7, "", 0);
  } else if (game.pastGuesses.indexOf(guess) !== -1) {
    // case when guess has already been guessed
    createAlertObject(2, 4, 8, guess, 0);
  } else {
    // case when guess is valid
    game.currentGuess = guess;
    game.makeGuess(game.currentGuess);
    game.pastGuesses.push(guess);
  }
});

// Getting a hint
$("#hint-button").click( function () {
  "use strict";
  if ($("#submit-guess-input").attr("disabled")) {
    // if no game in progress, the hint is to start a new game :)
    createAlertObject(2, 0, 12, "", 0);
  } else {
    // create a alert with a hint
    createAlertObject(2, 7, 11, game.target, 0);
  }
});