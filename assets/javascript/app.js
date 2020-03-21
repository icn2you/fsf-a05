/******************************************************************************
FSWD:  Christopher B. Zenner
Date:  03/16/2020
File:  app.js
Ver.:  0.1.0 20200311
       
This JS script implements a basic trivia game in which the user is presented
with a question and four (4) options. The user is given 30 seconds to answer
the question. If the question is answered within the allotted time frame, the 
game notifies the user if the answer is correct or incorrect, and then pro-
ceeds to the next question. If the question is not answered within the allot-
ted time frame, the game offers the correct answer, and the proceeds to the 
next question. Once all questions have been answered (or left unanswered), the 
game displays the user's score (*i.e.*, the number of questions answered cor-
rectly and incorrectly as well as the number of questions left unanswered). 
The user is given the option to play again.
******************************************************************************/
const dataset = wonderWomen;
const numQns = 3;
const timeout = 30; // secs.
const wonderWomenTriviaInstr = "You will be given a series of " + numQns + " questions regarding famous women in history, accompanied by four (4) possible answers. (Yes, this is a multiple-choice test!) Click the option you think is correct. The game will tell you if your answer is right or wrong. Answer all of the questions correctly, and you may consider yourself a true feminist!";

class TriviaGame {
  // PROPERTIES
  name = "Trivia";
  instructions = "Click the Start Game button to begin.";
  #dataset = [];
  #resultImages = {
    "correctGIF": { "src": null, "alt": null },
    "incorrectGIF": { "src": null, "alt": null },
    "unansweredGIF": { "src": null, "alt": null }
  };
  #questions = [];
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
       NOTE: This method is currently not used. It is being left
             for reference and/or future use.
     ************************************************************* */
  resetGameState(qna) {
    this.#dataset = qna;
    
    while (this.#questions.length > 0) {
      this.#questions.pop();
    }
    
    this.#asked = 0;
    this.#correct = 0;
    this.#incorrect = 0;
    this.#unanswered = 0;  
  }  
}

// Execute script once page is fully loaded
$(document).ready(function() {
  // Create game object and define game-specific variables.
  var wonderWomenTrivia,
      wonderWoman,
      correctAns,
      stopwatch, 
      intervalID, 
      timeoutID;

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

    // Create container to hold result components
    // $("#question").append('<div id="result" class="container">');
    // $("#result").append('<div id="result-row" class="row">');
    // $("#result-row").append('<div id="result-photo" class="col-6">');
    // $("#result-col-1").append('<div id="result-col-2" class="col-6">');

    // Let the user know if their answer was right/wrong.
    $("#survey-says").append('<div id="result-comment">');
    $("#result-comment").text(comment);

    // If answer was wrong, display right answer.
    if (ans) {
      $("#result-comment").append('<div id="correct-ans">');
      $("#correct-ans").text("The correct answer is: " + ans);
    }

    // Display result GIF/image.
    $("#survey-says").append('<div id="result-img">');
    
    if (ans) {
      // ASSERT: Answer was incorrect or missed.
      $("#result-img").append('<img>');
    }
    else {
      // ASSERT: Answer was correct
      $("#result-img").append('<img class="img-thumbnail">');
      $("#wonder-woman").text(img.alt);
    }
    
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
      $("#wonder-woman").empty();

      if (wonderWomenTrivia.getNumQnsAsked() < numQns) {
        // ASSERT: Game is not over.
        wonderWoman = wonderWomenTrivia.getUniqueRandomQnA(); 
        correctAns = displayQnASet(wonderWoman);
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
    var gameStatsImg = wonderWomenTrivia.getCorrectAnsGIF(),
        correct = wonderWomenTrivia.getNumCorrectAns() + " correct",
        incorrect = wonderWomenTrivia.getNumIncorrectAns() + " incorrect",
        unanswered = wonderWomenTrivia.getNumUnans() + " unanswered",
        total = "Out of " + numQns + " questions:";

    // Display result GIF/image.
    $("#survey-says").append('<div id="result-img" style="max-width: inherit;">');
    $("#result-img").append('<img>');
    $("#result-img > img").attr({
      src: gameStatsImg.src,
      alt: gameStatsImg.alt
    });
    
    $("#survey-says").append('<div id="total-qns">');
    $("#total-qns").text(total);
    $("#survey-says").append('<ul id="player-stats">');
    $("#player-stats").append('<li id="correct-ans">');
    $("#correct-ans").text(correct);
    $("#player-stats").append('<li id="incorrect-ans">');
    $("#incorrect-ans").text(incorrect);
    $("#player-stats").append('<li id="not-ans">');
    $("#not-ans").text(unanswered);
    
    $("#game-launchpad").append('<button class="btn btn-outline-secondary">');
    $("#game-launchpad > button").text("New Game");
  }

  // Once player clicks the Start Game button, launch a new game.
  $("#game-launchpad").on("click", function() {
    // Create game object.
    wonderWomenTrivia = new TriviaGame("Real Wonder Women Trivia",
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

    // Get rid of the start button.
    $("#girl-power-img").remove();
    $("#survey-says").empty();
    $("#game-launchpad").empty();

    // Display initial Q&A set and remember correct answer.
    wonderWoman = wonderWomenTrivia.getUniqueRandomQnA(); 
    correctAns = displayQnASet(wonderWoman);
  });

  // Listen for player's answer.
  $("#options").on("click", function(event) {
    var targetID = "#" + event.target.id,
        targetIDContents = $(targetID).text();

    clearInterval(intervalID);
    clearTimeout(timeoutID);

    if (targetIDContents === correctAns) {
      // ASSERT: Player answered correctly.
      wonderWomenTrivia.incrementCorrectAns();

      displayResult("YOU GO, GIRL!", { "src": wonderWoman.photo, 
                                       "alt": wonderWoman.woman });
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
});