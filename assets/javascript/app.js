/******************************************************************************
FSWD:  Christopher B. Zenner
Date:  03/14/2020
File:  app.js
Ver.:  0.1.0 20200311
       
This JS script implements a basic trivia game in which the user is presented
with a question and four (4) options. The user is given 30 seconds to answer
the question. If the question is answered within the allotted timeframe, the 
game notifies the user if the answer is correct or incorrect, and then pro-
ceeds to the next question. If the question is not answered within the allot-
ted time frame, the game offers the correct answer, and the proceeds to the 
next question. Once all questions have been answered or missed, the game
displays the number of questions answered correctly and incorrectly. The user
is given the option to play again.
******************************************************************************/
const wonderWomenTriviaInstr = "Click the Start button to begin";
const dataset = "wonderWomen";
const numQns = 10;
const timeout = 30;

class TriviaGame {
  // PROPERTIES
  name = "Trivia";
  instructions = "";
  #dataset = [];
  #defaultImages = {
    "correctGIF": null,
    "incorrectGIF": null,
    "unansweredGIF": null
  };
  #correct = 0;
  #incorrect = 0;
  #unanswered = 0;

  // METHODS
  /* *************************************************************
     Constructor Method
     - Create an object of type TriviaGame
     ************************************************************* */
  constructor(name, instr, qna, images) {
    this.name = name;
    this.instructions = instr;
    this.#dataset = qna;
    this.#defaultImages = images;
  }
    
  /* *************************************************************
     Accessor Methods
     - Get object properties
     ************************************************************* */
  getGameName() {
    return this.name;
  }

  getGameInstr() {
    return this.instructions;
  }

  getTriviaQnA() {
    // Return random trivia Q&A set
    return this.#dataset[Math.floor(Math.random() * this.#dataset.length)];
  }

  getCorrectAnsGIF() {
    return this.#defaultImages.correctGIF;
  }

  getIncorrectAnsGIF () {
    return this.#defaultImages.incorrectGIF;
  }

  getUnansGIF () {
    return this.#defaultImages.unansweredGIF;
  }

  getNumCorrectAns() {
    return this.#correct;
  }

  getNumIncorrectAns() {
    return this.#incorrect;
  }

  getNumUnans() {
    return this.#unanswered;
  }

  /* *************************************************************
     getRandomQnA()
     - Retrieve a random question with answers from the dataset.
     ************************************************************* */      
  getRandomQnA() {
    // return ...;
  }

  /* *************************************************************
     incrementLosses()
     - Add a loss to player's tallies.
     ************************************************************* */      
  incrementCorrectAns() {
    this.#correct++;
  }
  
  /* *************************************************************
     incrementWins()
     - Add a win to player's tallies.
     ************************************************************* */    
  incrementIncorrectAns() {
    this.#incorrect++;
  }

  /* *************************************************************
     incrementWins()
     - Add a win to player's tallies.
     ************************************************************* */    
  incrementUnans() {
      this.#unanswered++;
  }

  /* *************************************************************
     resetGameState()
     - Reset relevant game properties such that a new game is
       initialized.
     ************************************************************* */
  resetGameState() {
      // ...  
  }  
}

// Execute script once page is fully loaded
$(document).ready(function() {
  let wonderWomenTrivia = new TriviaGame("Real Wonder Women Trivia",
    wonderWomenTriviaInstr,
    dataset,
    ["https://media.giphy.com/media/RIuHHNa7UgFKo/source.gif", 
     "https://media.giphy.com/media/5TC1o3oRE68Mg/source.gif", 
     "https://media.giphy.com/media/JzOyy8vKMCwvK/source.gif"]);

  var stopwatch = timeout;

  function displaySecsLeft() {
    stopwatch--;
    $("#stopwatch").text(stopwatch);
  }

  // Once player clicks the Start/Play Again buttons, launch a new game.
  $("button").on("click", function(event) {
    $("#game-launchpad").empty();
    $("#stopwatch").text(stopwatch);

    var interval = setInterval(displaySecsLeft, 1000);
    
    setTimeout(function() {
      console.log("Time's up!");
      clearInterval(interval);
    }, 30000);
  });
});