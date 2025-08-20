import { Player, GameBoard, Ship } from '../gamelogic/src.js';
const gameBoard = document.getElementsByClassName(`gameBoard`);

const PLAYERS = [];

// Add squares to the gameboard
for (let i = 0; i < 2; i++) {
    let board = Array.from(gameBoard)[i];
    board.dataset.playerIndex = i;

    let x = 0;
    let y = 0;

    const currIndex = function () {
        if (y > 9) { y = 0; x++ }
        return { x: x, y: y++ };
    }

    for (let i = 0; i < 100; i++) {
        let square = document.createElement(`div`);
        square.classList.add(`gamegrid`);
        const { x, y } = currIndex();
        square.dataset.indexX = x;
        square.dataset.indexY = y;
        board.appendChild(square);
    }

}

// Add Event Listener to gameboard grids
for (let i = 0; i < 2; i++) {
    let board = [...gameBoard][i];
    console.log(board);

    const grids = board.querySelectorAll('.gamegrid');
    console.log(grids);
    for (const grid of grids) {
        grid.addEventListener('click', () => {
            if (grid.classList.contains('gridModeShip')) {

                const playerIndex = Number(grid.parentElement.dataset.playerIndex);
                const x = Number(grid.dataset.indexX);
                const y = Number(grid.dataset.indexY);
                
                const player = PLAYERS[playerIndex];
                player.receiveAttack([x, y]);

                if(player.isAllSunk()){
                    for(const grid of grids){
                        console.log(`Game Over! ${player.name} lost!`);
                        grid.classList.add('gridModeDisabled');
                    }
                }

                grid.classList.add('gridModeHit');
                grid.classList.remove('gridModeShip');

                

            } else {
                grid.classList.add('gridModeDisabled');
            }

        })
    }

}


// Function to create two players at once
function createTwoPlayers(playerOneName, playerTwoName) {
    let newPlayerOne = new Player(playerOneName);
    let newPlayerTwo = new Player(playerTwoName);
    PLAYERS.push(newPlayerOne);
    PLAYERS.push(newPlayerTwo);
    return;
}

// Function that renders ships to respective boards
function showShips() {

    // TEST SHIPS
    createTwoPlayers(`W`, `R`);

    PLAYERS[0].placeShip(2, [[0, 0], [1, 0]], `V`);
    PLAYERS[0].placeShip(1, [[3, 5]], `V`);
    PLAYERS[1].placeShip(2, [[9, 0], [9, 1]], `H`);
    PLAYERS[1].placeShip(3, [[7, 0], [6, 0], [5, 0]], `V`);

    for (let i = 0; i < 2; i++) {
        const currPlayer = PLAYERS[i];
        const ships = currPlayer.allShips();
        for (const ship of ships) {
            for (const coordinate of ship.coordinates) {
                let x = `${coordinate[0]}`;
                let y = `${coordinate[1]}`;
                // console.log(typeof (x), typeof (y));
                let board = [...gameBoard].find(b => b.dataset.playerIndex === `${i}`);
                const grid = board.querySelector(`[data-index-x="${x}"][data-index-y="${y}"]`);
                grid.classList.add(`gridModeShip`);
                // console.log(grid);
            }
        }
        // console.log(ships);
    }
}


// MAIN FUNCTION
function main() {
    showShips();
}

main();