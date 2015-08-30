/** Globals
* Contains references to objects with global scope
* Dependencies: none
*/

// LOCAL STORAGE //

// check if local storage is supported
if (typeof (Storage) !== "undefined") {
  // check if storage already exists
  if (localStorage.storage) {
    // store JSON-parsed object in storage global
    var storage = JSON.parse(localStorage.getItem("storage"));
  } else {
    // if this is the first time, create an empty storage global
    var storage = {
      users: []
    };
  }
} else {
  // alert if local storage not supported
    prompt("Local Storage is not supported from this browser :(");
}

// BASIC GLOBALS //

// game global - holds a Game object
var game;
// player global - holds a Player object
var player;
// start time global - for time trial mode
var startTime;

// DICTIONARY GLOBALS //

// alerts dictionary - contains a dictionary of alert values for building new alerts
var alerts = {
  type: ["alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger"],
  exclaim: ["", "Yes! ", "Brr! ", "Yow! ", "Uh oh! ", "Oh noes! ", "Good guess! ", "You could "],
  body: ["", "You got it! It was: ", "Getting colder! Try again! You guessed: ", "Getting hotter! Take another guess! You guessed: ", "You've got one guess left! You guessed: ", "You're out of guesses! The answer was: ", "That's not valid - try guessing a whole number!", "Try guessing between 1 and 100!", "You already guessed ", "Here's a hint: the answer is higher than your guess of ", "Here's a hint: the answer is lower than your guess of ", "try guessing ", "Try starting a new game!"],
  hint: ["", " (Guess higher next time!)", " (Guess lower next time!)"]
  };

// achievements dictionary - contains a dictionary of achievements
var achievements = {
  type: ["alert alert-success achievement", "alert alert-info achievement", "alert alert-warning achievement", "alert alert-danger achievement"],
  title: ["", "First Fail", "First Win", "Failsafe", "So Be It...Jedi", "Time Travails", "Super Star"],
  description: ["", "There's a first time for everything! Keep trying!", "Alright! Congratulations on your first victory!", "Whoa, buddy! That's five fails! You've unlocked the Practice Mode difficulty - keep at it!", "I've got a bad feeling about this...you got the answer in one guess! You've unlocked the Jedi Knight difficulty!", "That's five victories! You now have access to Time Trial mode!", "Yow - that's ten victories! Great job!"]
}