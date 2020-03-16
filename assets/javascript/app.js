/******************************************************************************
FSWD:  Christopher B. Zenner
Date:  03/16/2020
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
const dataset = wonderWomen;
const numQns = 10;
const timeout = 30; // secs.

class TriviaGame {
  // PROPERTIES
  name = "Trivia";
  instructions = "";
  #dataset = [];
  #questions = [];
  #resultImages = {
    "correctGIF": null,
    "incorrectGIF": null,
    "unansweredGIF": null
  };
  #asked = 0;
  #correct = 0;
  #incorrect = 0;
  #unanswered = 0;

  // METHODS
  /* *************************************************************
     Constructor Method
     - Create an object of type TriviaGame
     ************************************************************* */
  constructor(name, instr, qna, imgs) {
    this.name = name;
    this.instructions = instr;
    this.#dataset = qna;
    this.#resultImages = imgs;
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

  getCorrectAnsGIF() {
    return this.#resultImages.correctGIF;
  }

  getIncorrectAnsGIF () {
    return this.#resultImages.incorrectGIF;
  }

  getUnansGIF () {
    return this.#resultImages.unansweredGIF;
  }

  getNumQnsAsked() {
    return this.#asked;
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
     Incrementer Methods
     - Increment various counts.
     ************************************************************* */      
  incrementQnsAsked() {
    this.#asked++;
  }
  
  incrementCorrectAns() {
    this.#correct++;
  }
  
  incrementIncorrectAns() {
    this.#incorrect++;
  }

  incrementUnans() {
    this.#unanswered++;
  }    

  /* *************************************************************
     getUniqueRandomQnA()
     - Retrieve a random question with answers from the dataset.
     ************************************************************* */      
  getUniqueRandomQnA() {
    // Return random trivia Q&A set
    var index;
    
    do {
      index = Math.floor(Math.random() * this.#dataset.length);
    }
    while(this.#questions.indexOf(index) > -1)

    this.#questions.push(index);

    // DEBUG:
    console.log("questions: " + this.#questions);

    return this.#dataset[index];
  }

  /* *************************************************************
     swapCorrectAns()
     - Randomize position of correct answer. Return index of 
       correct answer.
     ************************************************************* */
  swapCorrectAns(ans) {
    var correctAns = ans[0],
        index = Math.floor(Math.random() * ans.length),
        swappedAns = ans[index];

    ans[index] = correctAns;
    ans[0] = swappedAns;
    
    return index;
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
  // Create game object.
  let wonderWomenTrivia = new TriviaGame("Real Wonder Women Trivia",
    wonderWomenTriviaInstr,
    dataset,
    {
      "correctGIF": { 
        "src": "https://media.giphy.com/media/RIuHHNa7UgFKo/source.gif",
        "alt": "Rose Nylund's Strut" 
      }, 
      "incorrectGIF": {
        "src": "https://media.giphy.com/media/5TC1o3oRE68Mg/source.gif",
        "alt": "Rihanna's Check"
      }, 
      "unansweredGIF": {
        "src": "https://media.giphy.com/media/JzOyy8vKMCwvK/source.gif",
        "alt": "Judge Judy's Watch"
      }
    });

  // Define question-specific variables.
  var correctAns, stopwatch, intervalID, timeoutID;

  // ********************************************
  // displaySecsLeft() - UI stopwatch display
  // ********************************************
  function displaySecsLeft() {
    stopwatch--;
    $("#stopwatch").text("You have " + stopwatch + " seconds remaining.");
  }

  // ********************************************
  // resetStopwatch() - UI stopwatch reset
  // ********************************************
  function resetStopwatch() {
    stopwatch = timeout;
    $("#stopwatch").text("You have " + stopwatch + " seconds remaining.");
  }  

  // ********************************************
  // displayQnASet() - Trivia question w/answers
  // ********************************************
  function displayQnASet(qna) {
    var correctAnsID = wonderWomenTrivia.swapCorrectAns(qna.answers);

    // Initiate UI stopwatch.
    resetStopwatch();     

    $("#question").text(qna.question);

    qna.answers.forEach(function(ans, i) {
      var optID = "opt-0" + (i + 1);

      $("#options").append('<button type="button" class="list-group-item list-group-item-action" id="' + optID + '">');
      $('#' + optID).text(ans);
    });

    // Grab interval ID so it can be reset and launch stopwatch.
    intervalID = setInterval(displaySecsLeft, 1000);

    timeoutID = setTimeout(function() {
      // ASSERT: User did not answer question in allotted time.
      wonderWomenTrivia.incrementUnans();

      displayResult("TIME'S UP!", 
      wonderWomenTrivia.getUnansGIF(),
      correctAns);

      clearInterval(intervalID);

      getNextQn();
    }, (timeout * 1000));   

    wonderWomenTrivia.incrementQnsAsked();

    return qna.answers[correctAnsID];
  }

  // ********************************************
  // displayResult() - Player feedback
  // ********************************************
  function displayResult(comment, img, ans = null) {   
    // Clear Q&A set from UI.
    $("#question").empty();
    $("#options").empty();

    // Let the user know if their answer was right/wrong.
    $("#survey-says").append('<div id="result-comment">');
    $("#result-comment").text(comment);

    // If answer was wrong, display right answer.
    if (ans) {
      $("#result-comment").append('<div id="correct-ans">');
      $("#correct-ans").text("The correct answer is: " + ans);
    }

    // Display result GIF.
    $("#survey-says").append('<div id="result-img">');
    $("#result-img").append('<img>');
    $("#result-img > img").attr({
      src: img.src,
      alt: img.alt
    });
  } 
  
  // ********************************************
  // getNextQn() - UI refresh after wait
  // ********************************************
  function getNextQn() {
    setTimeout(function() {
      // Clear the UI to prepare for next question.
      $("#stopwatch").empty();
      $("#survey-says").empty();

      if (wonderWomenTrivia.getNumQnsAsked() < numQns) {
        // ASSERT: Game is not over. 
        correctAns = displayQnASet(wonderWomenTrivia.getUniqueRandomQnA());
      }
      else {
        // ASSERT: Game is over.
        displayGameStats();
      }
    }, ((timeout / 3) * 1000));
  }
  
  // ********************************************
  // displayGameStats() - Player game stats
  // ********************************************
  function displayGameStats() {
    var correct = wonderWomenTrivia.getNumCorrectAns() + " were correct.";
    var incorrect = wonderWomenTrivia.getNumIncorrectAns() + " were incorrect.";
    var unanswered = "And " + wonderWomenTrivia.getNumUnans() + " were unanswered.";
    var total = "Out of " + numQns + " questions:";

    $("#survey-says").append('<div id="total-qns">');
    $("#total-qns").text(total);
    $("#survey-says").append('<ul id="player-stats">');
    $("#player-stats").append('<li id="correct-ans">');
    $("#correct-ans").text(correct);
    $("#player-stats").append('<li id="incorrect-ans">');
    $("#incorrect-ans").text(incorrect);
    $("#player-stats").append('<li id="not-ans">');
    $("#not-ans").text(unanswered);
    
    $("#game-launchpad").append('<button class="btn btn-outline-secondary" id="start-btn">');
    $("#start-btn").text("New Game");
  }

  // Once player clicks the Start Game button, launch a new game.
  $("#start-btn").on("click", function() {
    // Get rid of the start button.
    $("#game-launchpad").empty();
  
    // Listen for player's answer.
    $("#options").on("click", function(event) {
      var targetID = "#" + event.target.id,
          targetIDContents = $(targetID).text();

      clearInterval(intervalID);
      clearTimeout(timeoutID);
  
      if (targetIDContents === correctAns) {
        // ASSERT: Player answered correctly.
        wonderWomenTrivia.incrementCorrectAns();

        displayResult("YOU GO, GIRL!", wonderWomenTrivia.getCorrectAnsGIF());
      } 
      else {
        // ASSERT: Player answered incorrectly.
        wonderWomenTrivia.incrementIncorrectAns();

        displayResult("I DON'T THINK SO!", 
                      wonderWomenTrivia.getIncorrectAnsGIF(),
                      correctAns);
      }

      getNextQn();
    });

    // Display initial Q&A set and remember correct answer.
    correctAns = displayQnASet(wonderWomenTrivia.getUniqueRandomQnA());
  });
});