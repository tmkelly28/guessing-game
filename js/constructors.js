/** Constructors
* Object constructors for the main objects used by the page
* Dependencies: globals.js, functions.js, dom_manipulators.js
*/

// Achievement constructor
function Achievement(type, title, description) {
  this.type = type;
  this.title = title;
  this.description = description;
}
Achievement.prototype.drawSelf = function () {
  modifyElementById("achievements", "");
  var div = makeElementWithClass("div", this.type, "");
  var icon = makeElementWithClass("span", "glyphicon glyphicon-ok-sign", "");
  var header = document.createTextNode("   Achievement Unlocked: ");
  var name = makeElementWithClass("strong", "", this.title);
  var space = makeElementWithClass("br", "", "");
  var desc = makeElementWithClass("em", "", this.description);
  var achievement = appendSiblingsToParent(div,[icon, header, name, space, desc]);
  drawAchievement(achievement);
};

// Alert object constructor & helper function
function Alert(type, exclaim, body, guess, hint) {
  this.type = type;
  this.exclaim = exclaim;
  this.body = body;
  this.guess = guess;
  this.hint = hint;
}
Alert.prototype.drawSelf = function () {
  var div = makeElementWithClass("div", this.type, "");
  var name = makeElementWithClass("strong", "", this.exclaim);
  var body = document.createTextNode(this.body);
  var guess = document.createTextNode(this.guess);
  var hint = document.createTextNode(this.hint);
  var alert = appendSiblingsToParent(div,[name, body, guess, hint]);
  drawAlert(alert);
};

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
    modifyAttributeByElementId("submit-guess-input", "disabled", "");
    game.gameOver = true;
    player.incrementWins();
    validateGameEnd();
  } else if (this.totalGuesses === 0) {
    // defeat
    createAlertObject(3, 5, 5, this.target, 0);
    modifyAttributeByElementId("submit-guess-input", "disabled", "");
    modifyElementById("guesses-remaining", "--");
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
  // Used for building an alert in the alerts well
  if (guess > this.target) {
    // 2 is the index for the message to guess lower next time
    return 2;
  } else {
    // 1 is the index for the message to guess higher next time
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

// Instantiate default player
player = new Player(undefined, undefined, 0, 0, []);