class Ship {

    constructor(length, coordinates, orientation, noOfHits = 0) {
        this.length = length;
        this.noOfHits = noOfHits;
        this.coordinates = coordinates;
        this.orientation = orientation;
    }

    hit() {
        this.noOfHits++;
    }

    isSunk() {
        if (this.length == this.noOfHits) return true;
        return false;
    }
}

class GameBoard {

    ships = [];
    missedAttacks = [];
    hitAttacks = [];

    // length is a number and coordinates is an array of array of 'length' long and each array has 2 numbers each
    placeShip(length, coordinates, orientation) {
        let newShip = new Ship(length, coordinates, orientation);
        this.ships.push(newShip);
    }

    // coordinates in an array two numbers
    receiveAttack(coordinates) {
        let isAHit = false;

        function arraysEqual(a, b) {
            if (a.length !== b.length) return false;
            return a.every((val, index) => val === b[index]);
        };

        for (const ship of this.ships) {
            for (const coordinate of ship.coordinates) {
                if (arraysEqual(coordinate, coordinates)) {
                    this.hitAttacks.push(coordinates);
                    ship.hit();
                    isAHit = true;
                    break;
                }
            }
        };

        if (!isAHit) this.missedAttacks.push(coordinates);
    };

    isAllSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

}

class Player {

    constructor(name) {
        this.name = name;
        this.board = new GameBoard();
    }

    allShips() {
        return this.board.ships;
    }

    placeShip(length, coordinate, orientation) {
        return this.board.placeShip(length, coordinate, orientation);
    }

    receiveAttack(coordinates){
        return this.board.receiveAttack(coordinates);
    }

    isAllSunk(){
        return this.board.isAllSunk();
    }

}



function main() {
    let game = new GameBoard();
    game.placeShip(2, [[1, 1], [2, 1]]);
    game.receiveAttack([1, 1]);
    game.receiveAttack([3, 1]);
    console.log(game.hitAttacks);
    console.log(game.missedAttacks);
}

// main();


export { Player, GameBoard, Ship };