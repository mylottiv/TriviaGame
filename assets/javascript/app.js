$(document).ready(function(){
    // Initialize Player
    const Player = {
        right: 0,
        wrong: 0,
        missed: 0,
        timer: 30,
        currentQuiz: [],
        questionIndex: 0,
    };
    // Initialize splashBank as object (for key references)
    const splashBank = {
        displayWelcome: function(){
            $('#top-area').empty();
            $('#top-area').append(`            
                <div class='col my-col'>
                    <h2>Welcome to Aquatic Trivia!</h2>
                </div>`,);
            $('#bottom-area').empty();
            $('#bottom-area').append(`           
                <div class='col my-col'>
                    <button id='new-game' type="button">Click the button to begin!</button>
                </div>`);
        },
        displayTransition: function(number){
            $('#top-area').empty();
            $('#top-area').append(`            
                <div class='col my-col'>
                    <h2>QUESTION ${number}</h2>
                </div>`,);
            $('#bottom-area').empty();
            $('#bottom-area').append(`           
                <div class='col my-col'>
                    <h5>ARE YA READY KIDS?</h5>
                </div>`);
        },
        displayAnswered: function(result, message){
            let topDisplay = '';
            if (result === 'right'){
                topDisplay = "Congratulations! You guessed right!";
            }
            else if (result === 'wrong'){
                topDisplay = "That was incorrect! Sorry :(";
            }
            else if (result === 'timeout'){
                topDisplay = "Too bad! You're too slow!";
            }
            $('#top-area').empty();
            $('#top-area').append(`
                <div class='col my-col'>
                    <h2>${topDisplay}</h2>
                </div>`)
            $('#bottom-area').empty();
            $('#bottom-area').append(`            
                <div class='col my-col'>
                    <h5>${message}</h5>
                </div>`);
        },
        displayGameOver: function(score){
            $('#top-area').empty();
            $('#top-area').append(`            
                <div class='col my-col'>
                    <div class='row my-row'>
                        <div class='col my-col'>
                            <h2>GAME OVER</h2>
                        </div>
                    </div>
                    <div class='row my-row'>\
                        <div class='col my-col'>
                            <h4>You got a score of ${score}!</h4>
                        </div>
                    </div>
                </div>`);
            $('#bottom-area').empty();
            $('#bottom-area').append(`            
                <div class='col my-col'>
                    <button id='new-game' type="button">New Game</button>
                </div>`);
        }           
    }

    // Initialize questionBank
    const questionBank = [
        questionFactory("Who is Spongebob Squarepants' best friend?",
         'Squidward', 'Bubble Buddy', 'Patrick', 'Mr. Krabbs', 'Patrick', 'Spongebob and Patrick have been besties since Day 1!'),
        questionFactory('What is the largest known aquatic animal?',
         'Great White Shark', 'Megalodon', 'Patrick', 'Blue Whale', 'Blue Whale',
         "Not only are Blue Whales the largest known aquatic animal, they're the largest known animal EVER!"),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
        questionFactory('this is a question', 'a', 'b', 'c', 'd', 'c', 'something relevant'),
    ];

    // Initialize Welcome Splash card
    splashBank.displayWelcome();

    // question object factory
    function questionFactory(text, answer0, answer1, answer2, answer3, correct, explanation){
        return {
            text: text,
            answers: [answer0, answer1, answer2, answer3],
            correct: correct,
            explanation: explanation,
        }
    }

    // newGame event listener (core game loop)
    $('#bottom-area').on('click', '#new-game',function (){
        // Resets player stats
        Player.right = 0;
        Player.wrong = 0;
        Player.missed = 0;
        Player.questionIndex = 0;
        Player.currentQuiz = [];

        // Initializes randomCounter
        let randomCounter = [];

        // Picks questions from bank at random to build a new quiz array
        for (let i = 0; i < questionBank.length; i++){
            let randomDraw = Math.floor(Math.random() * questionBank.length);

            // Keep drawing a random number until an unused one is drawn
            while (randomCounter.find(e => e === randomDraw) !== undefined){
                randomDraw = Math.floor(Math.random() * questionBank.length);
            }

            // Adds randomly chosen question from bank to the new quiz
            Player.currentQuiz.push(questionBank[randomDraw]);

            // Updates randomCounter
            randomCounter.push(randomDraw)
        }
        
        // Calls nextQuestion for first question
        nextQuestion()
    })

    // answer event listener
    $('#bottom-area').on('click', '.answer', function (){

        // Stop and reset timer
        clearInterval(Player.timerID);
        Player.timer = 30;

        // Correct answers increase player's score
        if ($(this).data('correct') === true){
            Player.right++;
            nextQuestion('right');
        }

        // Wrong answers don't
        else {
            Player.wrong++;
            nextQuestion('wrong');
        }
    });

    // nextQuestion function
    function nextQuestion(result){
        
        // If not first question or last question, display results splash card first
        if (Player.questionIndex !== 0){
            splashBank.displayAnswered(result, Player.currentQuiz[Player.questionIndex-1].explanation)
            // Checks if last question
            if (Player.questionIndex === 10){
                setTimeout(splashBank.displayGameOver, 2000, (`${Player.right}/10`));
            }
            else {
                setTimeout(splashBank.displayTransition, 2000, (Player.questionIndex+1));
            }
        }
        
        // Otherwise display transition card immediately
        else {
            splashBank.displayTransition(Player.questionIndex+1);
        }
        if (Player.questionIndex >= 0 && Player.questionIndex < 10){
            // Displays new question after 5 second timeout
            setTimeout(function(){
                Player.questionIndex++;
                displayQuestion(Player.currentQuiz[Player.questionIndex-1], (Player.questionIndex));
                // Starts timer countdown
                Player.timerID = setInterval(function(){
                    Player.timer--;
                    $('#question-timer > div').text(Player.timer)
                    if (Player.timer === 0){
                        clearInterval(Player.timerID);
                        Player.timer = 5;
                        Player.missed++;
                        nextQuestion('timeout');
                    }
                }, 1000)
            }, 4000);
        }
    }

    // displayQuestion function
    function displayQuestion(question, number){
        // First populates the top half of the card
        $('#top-area').empty();
        $('#top-area').append(`
            <div id='question-info' class='col'>
                <div id='question-number' class='row my-row'>
                    <div class='col'>
                        ${number}/10
                    </div>
                </div>
                <div id='question-timer' class='row my-row'>
                    <div class='col'>
                        ${Player.timer}
                    </div>
                </div>
            </div>
            <div id='question-text' class='col'>
                <div id='title' class='row my-row'>
                    <div class='col'>
                        <h5>Quiz!</h5>
                    </div>
                </div>
                <div id='question' class='row my-row'>
                    <div class='col'>
                        <h6>${question.text}</h6>
                    </div>
                </div>
            </div>
            <div id='question-stats' class='col'>
                <div id='right' class='row my-row'>
                    <div class='col'>
                        Right: ${Player.right}
                    </div>
                </div>
                <div id='wrong' class='row my-row'>
                    <div class='col'>
                        Wrong: ${Player.wrong}
                    </div>
                </div>                            
                <div id='missed' class='row my-row'>
                    <div class='col'>
                        Missed: ${Player.missed}
                    </div>
                </div>                        
            </div>`);

        // Randomizing the order answers displayed
        let newOrder = [];
        let rightAnswer;
        for (let i=0; i < question.answers.length; i++){
            let randomDraw = Math.floor(Math.random() * question.answers.length)

            // Keep drawing a random number until an unused one is drawn
            while (newOrder.find(e => e === randomDraw) !== undefined){
                randomDraw = Math.floor(Math.random() * question.answers.length);
            }

            // Check if correct answer
            if (rightAnswer === undefined && question.correct === question.answers[randomDraw]){
                rightAnswer = i;
            }
            newOrder.push(randomDraw);
        }
        // Then populates the bottom area
        $('#bottom-area').empty();
        $('#bottom-area').append(`                        
            <div id='answers-left' class='col'>
                <div id='answer-1' class='row my-row'>
                    <div class='col answer' data-correct='${((rightAnswer === 0) ? 'true' : 'false')}'>
                        ${question.answers[newOrder[0]]}
                    </div>
                </div>
                <div id='answer-2' class='row my-row'>
                    <div class='col answer' data-correct=${((rightAnswer === 1) ? 'true' : 'false')}>
                        ${question.answers[newOrder[1]]}
                    </div>                
                </div>
            </div>
            <div id='answers-right' class='col'>
                <div id='answer-3' class='row my-row'>
                    <div class='col answer' data-correct=${((rightAnswer === 2) ? 'true' : 'false')}>
                        ${question.answers[newOrder[2]]}
                    </div>                  
                </div>
                <div id='answer-4' class='row my-row'> 
                    <div class='col answer' data-correct=${((rightAnswer === 3) ? 'true' : 'false')}>
                        ${question.answers[newOrder[3]]}
                    </div>  
                </div>
            </div>`);
    }
})

