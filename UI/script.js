import { Player, GameBoard, Ship } from '../gamelogic/src.js';

const gameboards = document.getElementsByClassName(`gameBoard`);
const ships = document.getElementsByClassName(`shipOuterFrame`);
const turnButton = document.getElementsByClassName(`turnButton`);

const PLAYERS = [];
const SHIPPOOL = [
    { // Player 0
        battleship: 1,
        cruiser: 2,
        destroyer: 3,
    },
    { // Player 1
        battleship: 1,
        cruiser: 2,
        destroyer: 3,
    }
];

// STATES : placement / gameplay / gameover
const STATE = {
    phase: "placement",
    playerIndex: 0
}

// Add Inner grids
for (const gameboard of gameboards) {

    let x = 0;
    let y = 0;

    function getIndex() {
        const index = { x, y };
        y++;
        if (y > 9) {
            y = 0;
            x++;
        }
        if (x > 9) {
            x = 0;
        }
        return index;
    }

    for (let i = 0; i < 100; i++) {
        const index = getIndex();

        const grid = document.createElement(`div`);
        grid.classList.add(`gameGrid`);
        grid.dataset.touched = false;
        grid.dataset.xIndex = index.x;
        grid.dataset.yIndex = index.y;
        gameboard.appendChild(grid);
    }

}

// add drag and drop

// Drag and drop variabkes
for (const ship of ships) {
    ship.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("shipID", ship.id);
    })
}

// Function to reduce ship placement
function checkShipLimit(playerIndex) {
    const playerShips = SHIPPOOL[playerIndex];

    if (playerShips["battleship"] <= 0) {
        const shipHTML = document.getElementById(`battleship`);
        shipHTML.classList.add(`disableShipPlacement`);
        // console.log(shipHTML);
    }
    if (playerShips["cruiser"] <= 0) {
        const shipHTML = document.getElementById(`cruiser`);
        shipHTML.classList.add(`disableShipPlacement`);
    }
    if (playerShips["destroyer"] <= 0) {
        const shipHTML = document.getElementById(`destroyer`);
        shipHTML.classList.add(`disableShipPlacement`);
    }
}

function enableShipPlacement(playerIndex) {
    const playerShips = SHIPPOOL[playerIndex];
    if (playerShips["battleship"] > 0) {
        const shipHTML = document.getElementById(`battleship`);
        shipHTML.classList.remove(`disableShipPlacement`);
        // console.log(shipHTML);
    }
    if (playerShips["cruiser"] > 0) {
        const shipHTML = document.getElementById(`cruiser`);
        shipHTML.classList.remove(`disableShipPlacement`);
    }
    if (playerShips["destroyer"] > 0) {
        const shipHTML = document.getElementById(`destroyer`);
        shipHTML.classList.remove(`disableShipPlacement`);
    }
}

// function to count ship placements
function countShipPlacement(shipType, playerIndex) {
    const currShip = SHIPPOOL[playerIndex];
    currShip[shipType]--;
    return;
}


// dragover and drop function for boards
function enableDrop(playerIndex) {

    const gameboard = gameboards[playerIndex];

    gameboard.addEventListener('dragover', (e) => e.preventDefault());

    gameboard.addEventListener('drop', (e) => {
        e.preventDefault();
        console.log(gameboard);
        const rect = gameboard.getBoundingClientRect();

        const cell = document.querySelector(".gameGrid");
        const cellSize = cell.getBoundingClientRect().width; // or height

        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;

        const col = Math.floor(dropX / cellSize);
        const row = Math.floor(dropY / cellSize);


        let dropped = document.getElementById(e.dataTransfer.getData("shipID"));
        const shipType = dropped.getAttribute(`id`);

        const orientation = dropped.dataset.orientation;
        const shipLength = Number(dropped.dataset.length);

        console.log(orientation, `length: `, shipLength, `row:`, row, `col:`, col);

        // Check Overflow
        if (
            (orientation === 'h' && (col + shipLength - 1 > 9)) ||
            (orientation === 'v' && (row + shipLength - 1 > 9))
        ) {
            console.error(`Can't place here!`);
            return;
        }


        let shipCoordinates = [];

        for (let i = 0; i < shipLength; i++) {
            if (orientation === 'v') {
                shipCoordinates.push([row + i, col]);
            } else if (orientation === 'h') {
                shipCoordinates.push([row, col + i]);
            }
        }

        // console.log(shipCoordinates);

        let neighbors = [];

        for (const [row, col] of shipCoordinates) {
            // console.log(row, col);
            for (const r of [-1, 0, 1]) {
                for (const c of [-1, 0, 1]) {
                    const nRow = row + r;
                    const nCol = col + c;

                    if (nRow >= 0 && nRow < 10 && nCol >= 0 && nCol < 10) {
                        neighbors.push([nRow, nCol]);
                    }
                }
            }
        }

        let invalidLocation = neighbors.some(([row, col]) =>
            gameboard
                .querySelector(`.gameGrid[data-x-index="${row}"][data-y-index="${col}"]`)
                ?.classList.contains("gridModeShip")
        );

        if (invalidLocation) {
            console.error(`Cant place there!`);
            return;
        } else {
            // Add ship to the object first
            const playerIndex = Number(gameboard.dataset.playerIndex);
            const currPlayer = PLAYERS[playerIndex];
            currPlayer.placeShip(shipLength, shipCoordinates, orientation);
            // console.log(currPlayer);

            // Update Ship counts and check for limit
            countShipPlacement(shipType, playerIndex);
            checkShipLimit(playerIndex);
            // console.log(SHIPPOOL[playerIndex]);

            // Shop ships in UI
            for (const [row, col] of shipCoordinates) {
                const grid = gameboard.querySelector(`.gameGrid[data-x-index="${row}"][data-y-index="${col}"]`);
                grid.classList.add(`gridModeShip`);
            }
        }

        // console.log(neighbors);

    })
}


// check if someone won 
function checkAllSunks() {
    if (PLAYERS[0].isAllSunk()) {
        STATE.phase = 'gameover';
        STATE.playerIndex = 1;
    }
    if (PLAYERS[1].isAllSunk()) {
        STATE.phase = 'gameover';
        STATE.playerIndex = 0;
    }
}


function handleAttackClick(e) {
    const grid = e.currentTarget;

    if (grid.classList.contains(`gridModeUntouched`)) {
        // make cell visible
        grid.classList.remove(`gridModeUntouched`);
    }

    if (grid.classList.contains(`gridModeShip`)) {
        const playerIndex = Number(grid.parentElement.dataset.playerIndex);
        const player = PLAYERS[playerIndex];

        const x = Number(grid.dataset.xIndex);
        const y = Number(grid.dataset.yIndex);

        player.receiveAttack([x, y]);
        checkAllSunks();

        // change UI
        grid.classList.remove(`gridModeShip`);
        grid.classList.add(`gridModeHit`);
        grid.classList.add(`gridModeDisabled`);
        grid.dataset.touched = true;
    } else {
        // Disable empty cells UI
        grid.classList.add(`gridModeDisabled`);
        grid.dataset.touched = true;
    }
}

function enableAttacking(playerIndex) {
    const board = document.querySelector(`.gameBoard[data-player-index="${playerIndex}"]`);
    const grids = board.querySelectorAll(`.gameGrid`);

    for (const grid of grids) {
        grid.addEventListener('click', handleAttackClick);
    }
}


function disableAttacking(playerIndex) {
    const board = document.querySelector(`.gameBoard[data-player-index="${playerIndex}"]`);
    const grids = board.querySelectorAll(`.gameGrid`);

    for (const grid of grids) {
        grid.removeEventListener('click', handleAttackClick);
    }
}



// Event listener to flip ships
for (const button of turnButton) {
    button.addEventListener('click', () => {
        const shipFrame = button.parentElement.querySelector(`.shipOuterFrame`);
        // console.log(shipFrame.dataset.orientation);
        shipFrame.dataset.orientation = shipFrame.dataset.orientation === 'v' ? 'h' : 'v';
    })
}

// function to hide a board
function hideBoard(playerIndex) {
    const board = document.querySelector(`.gameBoard[data-player-index="${playerIndex}"]`);
    board.classList.add(`disableAndHideBoard`);
    const grids = board.getElementsByClassName(`gameGrid`);
    // console.log(grids);
    for (const grid of grids) {
        grid.classList.add(`gridModeHide`);
    }
}

function ShowBoard(playerIndex) {
    const board = document.querySelector(`.gameBoard[data-player-index="${playerIndex}"]`);
    board.classList.remove(`disableAndHideBoard`);
    const grids = board.getElementsByClassName(`gameGrid`);
    // console.log(grids);
    for (const grid of grids) {
        grid.classList.remove(`gridModeHide`);
    }
}

// create a player
function createPlayer(playerName) {
    const player = new Player(playerName);
    PLAYERS.push(player);
    return;
}

async function waitForPlacement(playerIndex) {
    return new Promise((resolve) => {
        const playerShips = SHIPPOOL[playerIndex];

        const isDone = setInterval(() => {
            if (playerShips["battleship"] == 0 && playerShips["cruiser"] == 0 && playerShips["destroyer"] == 0) {
                clearInterval(isDone);
                resolve(true);
            }
        }, 200)
    })
}

function showAllGrids(playerIndex) {
    const board = document.querySelector(`.gameBoard[data-player-index="${playerIndex}"]`);
    const grids = board.getElementsByClassName(`gameGrid`);
    for (const grid of grids) {
        grid.classList.remove(`gridModeUntouched`);
    }
}

function hideUntouchedGrids(playerIndex) {
    const board = document.querySelector(`.gameBoard[data-player-index="${playerIndex}"]`);
    const grids = board.getElementsByClassName(`gameGrid`);
    for (const grid of grids) {
        if (grid.dataset.touched === 'false') {
            grid.classList.add(`gridModeUntouched`);
        }
    }
}

async function game() {

    if (STATE.phase == 'placement') {
        if (STATE.playerIndex == 0) {
            ShowBoard(0);
            hideBoard(1);
            enableDrop(0);
            const isDone = await waitForPlacement(0);

            if (isDone) {
                STATE.playerIndex = 1;
            }
        }

        if (STATE.playerIndex == 1) {
            enableShipPlacement(1);
            ShowBoard(1);
            hideBoard(0);
            enableDrop(1);

            const isDone = await waitForPlacement(1);

            if (isDone) {
                STATE.phase = 'game';
                STATE.playerIndex = 0;
            }
        }
    }

    if (STATE.phase == 'game') {
        if (STATE.playerIndex == 0) {
            ShowBoard(0);
            showAllGrids(0);
            hideUntouchedGrids(1);
            enableAttacking(1);
            disableAttacking(0);
        }
    }

}

function main() {
    const playerZero = createPlayer(`Zero`);
    const playerOne = createPlayer(`One`);
    // enableAttacking();
    // enableDrop(1);
    game();
    // hideBoard(0);
}

main();