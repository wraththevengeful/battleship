class Ship {

    noOfHits = 0;

    constructor(length, coordinates) {
        this.length = length;
        this.coordinates = coordinates;
    }

    hit() {
        if (this.isSunk()) return;
        this.noOfHits++;
    }

    isSunk() {
        if (this.noOfHits === this.length) return true;
        return false;
    }
}

class GameBoard {

    ships = [];
    missedAttacks = [];
    hitAttacks = [];

    placeShip(length, coordinates) {
        let ship = new Ship(length, coordinates);
        this.ships.push(ship);
    }

    receiveAttack(attackCoordinates) {

        let hit = false;

        this.ships.forEach(ship => {
            ship.coordinates.some(coordinate => {
                if (coordinate[0] == attackCoordinates[0] && coordinate[1] == attackCoordinates[1]) {
                    ship.hit();
                    this.hitAttacks.push(attackCoordinates);
                    hit = true;
                    return;
                }
            })
        });

        if (!hit) {
            this.missedAttacks.push(attackCoordinates);
        }
    }

    isAllSunk(){

        for(let ship of this.ships){
            if(ship.isSunk() == false) return false; 
        }
        return true;
    }
}


class Player{
    
    gameboard = new GameBoard();

    constructor(){

    }
}

export { Ship, GameBoard, Player };