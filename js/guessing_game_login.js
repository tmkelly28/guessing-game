// check if local storage is supported
if (typeof (Storage) !== "undefined") {
  // check if storage already exists
  if (localStorage.storage) {
    // store JSON-parsed object in storage variable
    var storage = JSON.parse(localStorage.getItem("storage"));
  } else {
    // if this is the first time, create an empty storage object
    var storage = {
      users: []
    };
  }
} else {
  // alert if local storage not supported
    prompt("Local Storage is not supported from this browser :(");
}

// Returning user button
$("#prev-login").click(function () {
  var usr = $("#prev-usr").val();
  var pwd = $("#prev-pwd").val();
  var usrInfo = validateLogin(usr, pwd);
  if (usrInfo === "error") {  
    return;
  } else {
    setUpPlayer(usrInfo);
  }
});

// New user button
$("#new-signup").click(function () {
  var usr = $("#new-usr").val();
  var pwd = $("#new-pwd").val();
  var usrInfo = validateSignUp(usr, pwd);
  if (usrInfo === "error") {  
    return;
  } else {
    setUpPlayer(usrInfo);
  }
});

// Validate the sign up info for new users
function validateSignUp(usr, pwd) {
  if (usr.length < 3) {
    // reject - username must be at least three chars
    $("#error-info-signup").html("Username must be at least 3 characters!");
    $("#new-signup").attr("data-dismiss", "");
    return "error";
  }
  if (pwd.length < 3) {
    // reject - pwd must be at least three chars
    $("#error-info-signup").html("Password must be at least 3 characters!");
    $("#new-signup").attr("data-dismiss", "");
    return "error";
  }
  for (i = 0; i < storage.users.length; i++) {
    if (storage.users[i].usrname === usr) {
      // reject - name already taken
      $("#error-info-signup").html("Another player has already chosen this name!");
      $("#new-signup").attr("data-dismiss", "");
      return "error";
    }
  }
  // success - returns a new player with the username and password
  $("#new-signup").attr("data-dismiss", "modal");
  return [usr, pwd, 0, 0, []];
}

// Validate the login in button for returning users
function validateLogin(usr, pwd) {
  // check for no data in storage
  if (storage.users.length === 0) {
    // reject - no data in storage
    $("#error-info-login").html("The credentials entered did not match our records. Please check your spelling!");
    $("#prev-login").attr("data-dismiss", "")
    return "error";
  }
  // check for a match in storage
  for (i = 0; i < storage.users.length; i++) {
    // success - return the chosen player object from storage.users
    if (storage.users[i].usrname === usr && storage.users[i].pwd === pwd) {
      $("#prev-login").attr("data-dismiss", "modal");
      return [storage.users[i].usrname, storage.users[i].pwd, storage.users[i].wins, storage.users[i].losses, storage.users[i].achievements];
    }
  }
  // reject - does not match records
  $("#error-info-login").html("The credentials entered did not match our records. Please check your spelling!");
  $("#prev-login").attr("data-dismiss", "")
  return "error";
}

// Set up the player
function setUpPlayer(usrInfo) {
  player = new Player(usrInfo[0], usrInfo[1], usrInfo[2], usrInfo[3], usrInfo[4]);
  $("#username-current").html(player.usrname);
  $("#achievements-earned-button").css("display", "inline-block");
  if (player.achievements.indexOf("Time Travails") >= 0) {
    $("#time-trial-button").css("display", "inline-block");
  } else {
    $("#time-trial-button").css("display", "none");
  }
  if (player.achievements.indexOf("Failsafe") >= 0) {
    $("#difficulty-practice").css("display", "inline-block");
  } else {
    $("#difficulty-practice").css("display", "none");
  }
  if (player.achievements.indexOf("So Be It...Jedi") >= 0) {
    $("#difficulty-jedi").css("display", "inline-block");
  } else {
    $("#difficulty-jedi").css("display", "none");
  }
  calculateWinLoss();
  savePlayer();
  saveLocalStorage();
  resetGameState();
  clearUsrPwdField();
}

// Set wins and losses in the navbar
function calculateWinLoss() {
  $("#win-count").html(player.wins);
  $("#loss-count").html(player.losses);
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

// "resets" the current game
function resetGameState() {
  $("#alerts").html("");
  $("#guesses-remaining").html("--");
  $("#submit-guess-input").val("");
  $("#submit-guess-input").attr("disabled", "");
}

// clear the name and password modal fields
function clearUsrPwdField() {
  $(".usrpwd").val("");
}