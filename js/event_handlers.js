/** Event Handlers
* Contains all event handlers
* Dependencies: globals.js, constructors.js, functions.js, dom_manipulators.js
* 
*/

$(document).ready(function () {
  // Select difficulty buttons
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
  
  // Time Trial Mode button
  $("#time-trial-button").click(function () {
    startNewGame(Infinity);
    game.timeTrialMode = true;
    startTime = Date.now();
  });
  
  // Guess button
  $("#submit-guess-button").click(function () {
    validateGuess();
  });
  
  // Enter keypress
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
  
  // Hint Button
  $("#hint-button").click(function () {
    if ($("#submit-guess-input").attr("disabled")) {
      // if no game in progress, the hint is to start a new game :)
      createAlertObject(2, 0, 12, "", 0);
    } else {
      // create a alert with a hint
      createAlertObject(2, 7, 11, game.target, 0);
    }
  });
  
  // View Achievements Button
  $("#achievements-earned-button").click(function () {
    $("#alerts").html("");
    if (player.achievements.length === 0) {
      var newAlert = new Alert(alerts.type[1], alerts.exclaim[0], "Nothing yet, chief - try starting a new game!", "", alerts.hint[0]);
      newAlert.drawSelf();
      return;
    }
    for (i = 0; i < player.achievements.length; i++) {
      var newAlert = new Alert(alerts.type[0], alerts.exclaim[0], player.achievements[i], "", alerts.hint[0]);
      newAlert.drawSelf();
    }
  });
  
  // Clear user and password fields when modal closes
  $(".clear-modal").click(function() {
    clearUsrPwdField();
  });
  
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
});