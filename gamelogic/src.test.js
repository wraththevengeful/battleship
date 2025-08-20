import { Ship, GameBoard } from './src';

test(`Ship CLass : Initialization`, () => {
    expect(new Ship(6)).toEqual({ noOfHits: 0, length: 6 });
})

test(`Ship CLass : Hits`, () => {
    const newShip = new Ship(6);
    newShip.hit()
    expect(newShip).toEqual({ noOfHits: 1, length: 6 });
})

test(`Ship CLass : isSunk`, () => {
    const newShip = new Ship(6);
    for (let i = 0; i < 6; i++) {
        newShip.hit();
    }
    expect(newShip.isSunk()).toBe(true);
})

test(`Ship CLass : Stop Hits after isSunk`, () => {
    const newShip = new Ship(6);
    for (let i = 0; i < 70; i++) {
        newShip.hit();
    }
    expect(newShip.noOfHits).toBe(newShip.length);
})

test(`Gameboard : Test Placing Ships 1`, () => {
    const game = new GameBoard();
    game.placeShip(3, [[0, 0], [1, 0], [2, 0]],`H`);
    expect(game.ships.length).toBe(1);
})

test(`Gameboard : Test Placing Ships 2`, () => {
    const game = new GameBoard();
    game.placeShip(3, [[0, 0], [1, 0], [2, 0]],`H`);
    expect(game.ships[0].coordinates).toEqual([[0, 0], [1, 0], [2, 0]]);
})

test(`Gameboard : Attack a Ship in board`, () => {
    const game = new GameBoard();
    game.placeShip(3, [[0, 0], [1, 0], [2, 0]],`H`);
    game.receiveAttack([0,0]);
    game.receiveAttack([1,0])
    expect(game.ships[0].noOfHits).toBe(2);
})

test(`Gameboard : track attacks`, () => {
    const game = new GameBoard();
    game.placeShip(3, [[0, 0], [1, 0], [2, 0]],`H`);
    game.receiveAttack([0,0]);
    game.receiveAttack([1,0])
    expect(game.hitAttacks.length).toBe(2);
})

test(`Gameboard : track attacks`, () => {
    const game = new GameBoard();
    game.placeShip(3, [[0, 0], [1, 0], [2, 0]],`H`);
    game.receiveAttack([0,0]);
    game.receiveAttack([1,0]);
    game.receiveAttack([4,0]);
    expect(game.hitAttacks).toEqual([[0,0],[1,0]]);
    expect(game.missedAttacks.length).toBe(1);
})

test(`Gameboard : track attacks`, () => {
    const game = new GameBoard();
    game.placeShip(3, [[0, 0], [1, 0], [2, 0]], `H`);
    game.receiveAttack([0,0]);
    game.receiveAttack([1,0]);
    game.receiveAttack([4,0]);
    expect(game.hitAttacks).toEqual([[0,0],[1,0]]);
    expect(game.isAllSunk()).toBe(false);
})