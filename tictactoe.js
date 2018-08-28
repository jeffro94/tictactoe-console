const readlineSync = require('readline-sync');

const introText = "\n\
Welcome to Tic Tac Toe! This game supports two players. \n\
Board spaces are denoted using positions 1-9 as shown  \n\
below. When the appropriate player is at the keyboard, \n\
type the space # of the desired move and press enter.  \n\
\n\
 1 | 2 | 3  \n\
----------- \n\
 4 | 5 | 6  \n\
----------- \n\
 7 | 8 | 9  \n\
\n\
Press enter to begin the game: ";

const playerChars = {
    1: 'X',
    2: 'O'
}

// initialize the game state
// game state is represented in a 2D array  
// where an empty space indicates an available spot  
// and "X" or "O" represents the spot taken by the corresponding player
//
let gameState = Array(3).fill(null).map(function() { return Array(3).fill(' ') });

// the player who is currently up
let playerTurn = 1;

// set to true once a player wins or stalemate is reached
let gameOver = false;

// show the intro text and wait for Enter to continue
readlineSync.question(introText);

// prompt for new moves until the game is over
while (!(gameOver)) {
    console.log(`\nIt's Player ${playerTurn}'s turn!`);
    console.log('\n' + gameStateToString());

    // ask for a new move location until a valid move is specified
    let nextMove, moveRow, moveCol;

    do {
        nextMove = readlineSync.question('Enter the location of your desired move (1-9): ', {limit: ['1','2','3','4','5','6','7','8','9']});

        // calcuate the array indicies for the corresponding desired move
        moveRow = Math.floor((nextMove - 1) / 3);
        moveCol = (nextMove - 1) % 3;

        if (gameState[moveRow][moveCol] != ' ')
            console.log(`Location ${nextMove} is already taken. Please try again.\n`);

    } while (gameState[moveRow][moveCol] != ' ')

    // update the gameState with the desired move of the current player
    gameState[moveRow][moveCol] = playerChars[playerTurn];

    if (checkForWinner(playerTurn, moveRow, moveCol)) {
        console.log(`\n${gameStateToString()}\nPlayer ${playerTurn} wins! Thanks for playing.\n`);
        break;
    }
    if (checkForStalemate()) {
        console.log(`\n${gameStateToString()}\nThe game ended in a stalemate. Thanks for playing!\n`);
        break;
    }

    // set the next player as active
    playerTurn = (playerTurn === 1) ? 2 : 1;
}

function gameStateToString() {
    let output = '';
    for (let i = 0; i < 3; i++) {
        output = output.concat(` ${gameState[i][0]} | ${gameState[i][1]} | ${gameState[i][2]} \n`);
        if (i < 2) output = output.concat('-----------\n');
    }
    return output;
}

/**
 * Check whether a player has won
 * @param {number} player - The player number of the current player to check
 * @param {number} moveRow - The row index of the last move
 * @param {number} moveCol - The column index of the last move
 * @returns {boolean}
 */
function checkForWinner(player, moveRow, moveCol) {
    // check the current row
    for (let i = 0; i < 3; i++) {
        if (gameState[moveRow][i] != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    // check the current column
    for (let i = 0; i < 3; i++) {
        if (gameState[i][moveCol] != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    // check the diagonal
    for (let i = 0; i < 3; i++) {
        if (gameState[i][i] != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    // check the reverse diagonal
    for (let i = 0; i < 3; i++) {
        if (gameState[i][2-i] != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    return false;
}

function checkForStalemate() {
    let freeSpaces = 0;
    gameState.forEach(function(row) {
        row.forEach(function(col) {
            if (col === ' ') freeSpaces++;
        })
    });
    return (freeSpaces == 0); // it's a stalemate if there are no remaining free spaces
}
