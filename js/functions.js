/** Functions
* Functions - eventually should be refactored to not directly interact with the DOM at all
* Dependencies: globals.js, constructors.js, dom_manipulators.js
*/
// Creating a new game
function startNewGame(defaultGuesses) {
  game = new Game(defaultGuesses);
  resetPageForNewGame();
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

// Validate game end/achievements earned, saves player state
function validateGameEnd() {
  calculateWinLoss();
  if (player.wins >= 1 && game.pastGuesses.length === 0 && !(player.hasAchievement("So Be It...Jedi"))) {
  // win on first guess, unlock Jedi Knight difficulty
    displayElementById("difficulty-jedi");
    addNewAchievement(0, 4, 4);
  } else if (player.wins >= 1 && !(player.hasAchievement("First Win"))) {
  // first win
    addNewAchievement(0, 2, 2);
  } else if (player.losses >= 1 && !(player.hasAchievement("First Fail"))) {
  // first loss
    addNewAchievement(0, 1, 1);
  } else if (player.losses >= 5 && !(player.hasAchievement("Failsafe"))) {
  // five losses, unlock Practice Mode difficulty
    displayElementById("difficulty-practice");
    addNewAchievement(0, 3, 3);
  } else if (player.wins >= 5 && !(player.hasAchievement("Time Travails"))) {
  // five wins, unlock Time Trial difficulty
    displayElementById("time-trial-button");
    addNewAchievement(0, 5, 5);
  } else if (player.wins >= 10 && !(player.hasAchievement("Super Star"))) {
  // ten wins
    addNewAchievement(0, 6, 6);
  }
  displayElementById("achievements-earned-button");
  removeAttributeByElementId("hint-button", "disabled");
  // show the time elapsed if this was a Time Trial game
  if (game.timeTrialMode) {
    var timeTotal = "Your time was: " + (Math.floor((Date.now() - startTime) / 1000)).toString() + " seconds!";
    createAlertObject(0, 0, 0, timeTotal, 0);
  }
  savePlayer();
  saveLocalStorage();
}

// Validate the sign up info for new users
function validateSignUp(usr, pwd) {
  if (usr.length < 3) {
    // reject - username must be at least three chars
    signUpReject("Username must be at least 3 characters!");
    return "error";
  }
  if (pwd.length < 3) {
    // reject - pwd must be at least three chars
    signUpReject("Password must be at least 3 characters!");
    return "error";
  }
  for (i = 0; i < storage.users.length; i++) {
    if (storage.users[i].usrname === usr) {
      // reject - name already taken
      signUpReject("Another player has already chosen this name!");
      return "error";
    }
  }
  // success - returns a new player with the username and password
  modifyAttributeByElementId("new-signup", "data-dismiss", "modal");
  return [usr, pwd, 0, 0, []];
}

// Validate the login in button for returning users
function validateLogin(usr, pwd) {
  // check for no data in storage
  if (storage.users.length === 0) {
    // reject - no data in storage
    loginReject();
    return "error";
  }
  // check for a match in storage
  for (i = 0; i < storage.users.length; i++) {
    // success - return the chosen player object from storage.users
    if (storage.users[i].usrname === usr && storage.users[i].pwd === pwd) {
      modifyAttributeByElementId("prev-login", "data-dismiss", "modal");
      return [storage.users[i].usrname, storage.users[i].pwd, storage.users[i].wins, storage.users[i].losses, storage.users[i].achievements];
    }
  }
  // reject - does not match records
  loginReject();
  return "error";
}

// Set up the player
function setUpPlayer(usrInfo) {
  player = new Player(usrInfo[0], usrInfo[1], usrInfo[2], usrInfo[3], usrInfo[4]);
  setUpPlayerInDom();
  calculateWinLoss();
  savePlayer();
  saveLocalStorage();
  resetPageForNewPlayer();
  clearUsrPwdField();
}

// add user data to storage global
function savePlayer() {
  // if using the default player, do not store anything
  if (player.usrname === undefined) {
    return;
  } else {
    // if using a previous player, save that player to the storage object    
    for (i = 0; i < storage.users.length; i++) {
      if (storage.users[i].usrname === player.usrname) {
          storage.users[i].wins = player.wins;
          storage.users[i].losses = player.losses;
          storage.users[i].achievements = player.achievements;
          return;
      }
    }
    // push the new player to the storage object
    storage.users.push(player);
  }
}

// store user data to local storage
function saveLocalStorage() {
  localStorage.setItem("storage", JSON.stringify(storage));
}

// creates an HTML element with a className and an inner textNode
function makeElementWithClass(elemName, clsName, text) {
  var element = document.createElement(elemName);
  element.className = clsName;
  element.appendChild(document.createTextNode(text));
  return element;
}

// appends HTML elements in sequence to a single parent
function appendSiblingsToParent(parentElem, siblingsArr) {
  for (var i = 0; i < siblingsArr.length; i++) {
    parentElem.appendChild(siblingsArr[i]);
  }
  return parentElem;
}

// creates a new achievement
function addNewAchievement(typeIdx, titleIdx, descIdx) {
  var newAchievement = new Achievement(achievements.type[typeIdx], achievements.title[titleIdx], achievements.description[descIdx]);
  player.earnAchievement(newAchievement.title);
  newAchievement.drawSelf();
}

// creates a new alert
function createAlertObject(typeIdx, exclaimIdx, bodyIdx, descIdx, hintIdx) {
  var newAlert = new Alert(alerts.type[typeIdx], alerts.exclaim[exclaimIdx], alerts.body[bodyIdx], descIdx, alerts.hint[hintIdx]);
  newAlert.drawSelf();
}