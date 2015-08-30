/** DOM Manipulators
* Functions that manipulate parts of the DOM
* Dependencies: none
*/

// sets the html contents of an element to be an empty string
function modifyElementById(id, mod) {
  var element = "#" + id;
  $(element).html(mod);
}

// clear the name and password modal fields
function clearUsrPwdField() {
  $(".usrpwd").val("");
  $(".login-error").html("");
}

// draws an achievement in the upper right corner of the window
function drawAchievement(achievement) {
  $("#achievements").prepend(achievement);
  $(".achievement").hide().slideDown(1000).fadeOut(5000);
}

// draws an alert in the alerts well
function drawAlert(alert) {
  $("#alerts").prepend(alert);
    // alert slidedown
  $($("#alerts").children("div")[0]).hide().slideDown();
  // prevent error if no game has been started since opening the browser
  if (game === undefined) {
    return;
  }
  // special animation at game over
  if (game.gameOver) {
    $($("#alerts").children("div")[0]).animate({
      fontSize: "15"
    }, 1000);
    $($("#alerts").children("div")[0]).animate({
      fontSize: "1em"
    }, 1000);
  }
}

// Modify/Set an attribute for an HTML element
function modifyAttributeByElementId(id, attr, val) {
  var element = "#" + id;
  $(element).attr(attr, val);
}

// Remove an attribute from an HTML element
function removeAttributeByElementId(id, attr) {
  var element = "#" + id;
  $(element).removeAttr(attr);
}

// handles cleaning up whenever a new game is started
function resetPageForNewGame() {
  $("#alerts").html("");
  $("#guesses-remaining").html(game.totalGuesses);
  $("#submit-guess-input").val("");
  $("#submit-guess-input").removeAttr("disabled");
  $("#achievements-earned-button").fadeOut();
}

// handles cleaning up whenever a new player logs in
function resetPageForNewPlayer() {
  $("#alerts").html("");
  $("#guesses-remaining").html("--");
  $("#submit-guess-input").val("");
  $("#submit-guess-input").attr("disabled", "");
}

// displays a hidden field
function displayElementById(id) {
  var element = "#" + id;
  $(element).css("display", "inline-block");
}

// Set wins and losses in the navbar
function calculateWinLoss() {
  $("#win-count").html(player.wins);
  $("#loss-count").html(player.losses);
}

// Sets up the new player in the DOM
function setUpPlayerInDom() {
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
}

// Reject login if credentials don't match
function loginReject() {
  modifyElementById("error-info-login", "The credentials entered did not match our records. Please check your spelling!");
  modifyAttributeByElementId("prev-login", "data-dismiss", "");
}

// Reject sign up for the reason passed as a parameter
function signUpReject(reason) {
  modifyElementById("error-info-signup", reason);
  modifyAttributeByElementId("new-signup", "data-dismiss", "");
}