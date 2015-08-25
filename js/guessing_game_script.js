// alerts dictionary - contains a dictionary of alert values for building new alerts
var alerts = {
  type: ["alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger"],
  exclaim: ["", "Yes! ", "Brr! ", "Yow! ", "Uh oh! ", "Oh noes! ", "Good guess! ", "You could "],
  body: ["", "You got it! It was: ", "Getting colder! Try again! You guessed: ", "Getting hotter! Take another guess! You guessed: ", "You've got one guess left! You guessed: ", "You're out of guesses! The answer was: ", "That's not valid - try guessing a whole number!", "Try guessing between 1 and 100!", "You already guessed ", "Here's a hint: the answer is higher than your guess of ", "Here's a hint: the answer is lower than your guess of ", "try guessing ", "Try starting a new game!"],
  hint: ["", " (Guess higher next time!)", " (Guess lower next time!)"]
  };
// game global - holds a Game object
var game;
// player global - holds a Player object
var player;
// achievements dictionary - contains a dictionary of achievements
var achievements = {
  type: ["alert alert-success achievement", "alert alert-info achievement", "alert alert-warning achievement", "alert alert-danger achievement"],
  title: ["", "First Fail", "First Win", "Failsafe", "So Be It...Jedi", "Time Travails", "Super Star"],
  description: ["", "There's a first time for everything! Keep trying!", "Alright! Congratulations on your first victory!", "Whoa, buddy! That's five fails! You've unlocked the Practice Mode difficulty - keep at it!", "I've got a bad feeling about this...you got the answer in one guess! You've unlocked the Jedi Knight difficulty!", "That's five victories! You now have access to Time Trial mode!", "Yow - that's ten victories! Great job!"]
}
// start time global - for time trial mode
var startTime;

// Alert object constructor & helper function
function Alert(type, exclaim, body, guess, hint) {
  this.type = type;
  this.exclaim = exclaim;
  this.body = body;
  this.guess = guess;
  this.hint = hint;
}
Alert.prototype.drawSelf = function () {
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
  var newAlert = new Alert(alerts.type[v], alerts.exclaim[w], alerts.body[x], y, alerts.hint[z]);
  newAlert.drawSelf();
}

// Game object constructor
function Game(totalGuesses) {
  this.target = Math.floor((Math.random() * 100) + 1);
  this.lastGuess = null;
  this.pastGuesses = [];
  this.totalGuesses = totalGuesses;
  this.gameOver = false;
  this.timeTrialMode = false;
}
Game.prototype.makeGuess = function (guess) {
  this.totalGuesses -= 1;
  if (guess === this.target) {
    // victory
    createAlertObject(0, 1, 1, guess, 0);
    $("#submit-guess-input").attr("disabled", "");
    game.gameOver = true;
    player.incrementWins();
    validateGameEnd();
  } else if (this.totalGuesses === 0) {
    // defeat
    createAlertObject(3, 5, 5, this.target, 0);
    $("#submit-guess-input").attr("disabled", "");
    $("#guesses-remaining").html("--");
    game.gameOver = true;
    player.incrementLosses();
    validateGameEnd();
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
  if (guess > this.target) {
    return 2;
  } else {
    return 1;
  }
};

// Player constructor
function Player(usrname, pwd, wins, losses, achievements) {
  this.usrname = usrname;
  this.pwd = pwd;
  this.wins = wins;
  this.losses = losses;
  this.achievements = achievements;
}
Player.prototype.incrementWins = function () {
  this.wins += 1;
};
Player.prototype.incrementLosses = function () {
  this.losses += 1;
};
Player.prototype.earnAchievement = function (achievement) {
  this.achievements.push(achievement);
};
Player.prototype.hasAchievement = function (achievement) {
  for (i = 0; i < this.achievements.length; i++ ) {
    if (this.achievements[i] === achievement) {
      return true;
    }
  }
  return false;
};

// Achievement constructor
function Achievement(type, title, description) {
  this.type = type;
  this.title = title;
  this.description = description;
}
Achievement.prototype.drawSelf = function () {
  $("#achievements").html("");
  var divEl = document.createElement("div"),
      spanEl = document.createElement("span"),
    strongEl = document.createElement("strong"),
    header = document.createTextNode("   Achievement Unlocked: "),
    brEl = document.createElement("br"),
    emEl = document.createElement("em"),
    title = document.createTextNode(this.title),
    description = document.createTextNode(this.description);
  divEl.className = this.type;
  spanEl.className = "glyphicon glyphicon-ok-sign";
  divEl.appendChild(spanEl);
  divEl.appendChild(header);
  strongEl.appendChild(title);
  divEl.appendChild(strongEl);
  divEl.appendChild(brEl);
  emEl.appendChild(description);
  divEl.appendChild(emEl);
  $("#achievements").prepend(divEl);
  $(".achievement").hide().slideDown(1000).fadeOut(5000);
};
function addNewAchievement(x, y, z) {
  var newAchievement = new Achievement(achievements.type[x], achievements.title[y], achievements.description[y]);
  player.earnAchievement(newAchievement.title);
  newAchievement.drawSelf();
}

// Creating a new game
function startNewGame(defaultGuesses) {
  game = new Game(defaultGuesses);
  $("#alerts").html("");
  $("#guesses-remaining").html(game.totalGuesses);
  $("#submit-guess-input").removeAttr("disabled");
  $("#achievements-earned-button").fadeOut();
}

// Validate a guess
function validateGuess() {
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
}

// Validate game end and achievements earned
function validateGameEnd() {
  calculateWinLoss();
  if (player.wins >= 1 && game.pastGuesses.length === 0 && !(player.hasAchievement("So Be It...Jedi"))) {
  // win on first guess, unlock Jedi Knight difficulty
    $("#difficulty-jedi").css("display", "inline-block");
    addNewAchievement(0, 4, 4);
  } else if (player.wins >= 1 && !(player.hasAchievement("First Win"))) {
  // first win
    addNewAchievement(0, 2, 2);
  } else if (player.losses >= 1 && !(player.hasAchievement("First Fail"))) {
  // first loss
    addNewAchievement(0, 1, 1);
  } else if (player.losses >= 5 && !(player.hasAchievement("Failsafe"))) {
  // five losses, unlock Practice Mode difficulty
    $("#difficulty-practice").css("display", "inline-block");
    addNewAchievement(0, 3, 3);
  } else if (player.wins >= 5 && !(player.hasAchievement("Time Travails"))) {
  // five wins, unlock Time Trial difficulty
    $("#time-trial-button").css("display", "inline-block");
    addNewAchievement(0, 5, 5);
  } else if (player.wins >= 10 && !(player.hasAchievement("Super Star"))) {
  // ten wins
    addNewAchievement(0, 6, 6);
  }
  $("#achievements-earned-button").css("display", "inline-block");
  $("#hint-button").removeAttr("disabled");
  // Show the time elapsed if this was a Time Trial game
  if (game.timeTrialMode) {
    var timeTotal = "Your time was: " + (Math.floor((Date.now() - startTime) / 1000)).toString() + " seconds!";
    var newAlert = new Alert(alerts.type[0], alerts.exclaim[0], timeTotal, "", alerts.hint[0]);
    newAlert.drawSelf();
    $("#alerts").children("div").hide().fadeIn();
  }
}

// DOM Events
$(document).ready(function () {
  // Selecting difficulty
  $("#difficulty-easy").click(function () {
    startNewGame(14);
  });
  $("#difficulty-medium").click(function () {
    startNewGame(7);
  });
  $("#difficulty-hard").click(function () {
    startNewGame(2);
  });
  $("#difficulty-practice").click(function () {
    startNewGame(Infinity);
  });
  $("#difficulty-jedi").click(function () {
    startNewGame(1);
    $("#hint-button").attr("disabled", "");
  });
  // Time Trial Mode
  $("#time-trial-button").click(function () {
    startNewGame(Infinity);
    game.timeTrialMode = true;
    startTime = Date.now();
  });
  // Use guess button to validate a guess
  $("#submit-guess-button").click(function () {
    validateGuess();
  });
  // Use Enter to validate a guess
  $(document).keypress(function(event) {
    if (event.which === 13) {
      validateGuess();
      $($("#alerts").children("div")[0]).hide().slideDown();
      if (game.gameOver) {
        // special animation at game over
        $($("#alerts").children("div")[0]).animate({
          fontSize: "15"
        }, 1000);
        $($("#alerts").children("div")[0]).animate({
          fontSize: "1em"
        }, 1000);
      }
    }
  });
  // Getting a hint
  $("#hint-button").click(function () {
    if ($("#submit-guess-input").attr("disabled")) {
      // if no game in progress, the hint is to start a new game :)
      createAlertObject(2, 0, 12, "", 0);
    } else {
      // create a alert with a hint
      createAlertObject(2, 7, 11, game.target, 0);
    }
  });
  // Alert animations
  $(".make-alerts").click(function () {
    // alert slidedown
    $($("#alerts").children("div")[0]).hide().slideDown();
    if (game.gameOver) {
      // special animation at game over
      $($("#alerts").children("div")[0]).animate({
        fontSize: "15"
      }, 1000);
      $($("#alerts").children("div")[0]).animate({
        fontSize: "1em"
      }, 1000);
    }
  });
  // Use Achievements Earned button
  $("#achievements-earned-button").click(function () {
    $("#alerts").html("");
    for (i = 0; i < player.achievements.length; i++) {
      var newAlert = new Alert(alerts.type[0], alerts.exclaim[0], player.achievements[i], "", alerts.hint[0]);
      newAlert.drawSelf();
      $("#alerts").children("div").hide().fadeIn();
    }
  });
});

// Instantiate default player
player = new Player(undefined, undefined, 0, 0, []);