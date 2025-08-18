const gameBoard = document.getElementsByClassName(`gameBoard`);



for (const board of [...gameBoard]) {
    let x = 0;
    let y = 0;

    const currIndex = function () {
        if (y > 9) {y = 0; x++}
        return { x: x, y: y++ };
    }

    for (let i = 0; i < 100; i++) {
        let square = document.createElement(`div`);
        square.classList.add(`gamegrid`);
        square.dataset.index = JSON.stringify(currIndex());
        board.appendChild(square);
    }
}