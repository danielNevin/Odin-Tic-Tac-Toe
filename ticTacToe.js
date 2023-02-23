"use strict";

const player = (mark) => {
  this.mark = mark;

  const getMark = () => {
    return mark;
  };

  return {getMark};
};

const gameBoard = (() => {
  const board = new Array(9).fill("");

  const setElement = (index, mark) => {
    if (index > board.length) {
      return;
    }

    board[index] = mark;
  };

  const getElement = (index) => {
    if (index > board.length) {
      return;
    }

    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  ;}

  return {setElement, getElement, reset}
})();

const displayController = (() => {
  const gameElements = document.querySelectorAll(".game-container-button");
  const messageBox = document.getElementById("message-text-div");
  const resetButton = document.getElementById("reset-button");

  gameElements.forEach((element) => 
    element.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") {
        return;
      }
      gameController.playRound(parseInt(e.target.dataset.index));
      updateBoard();
    })
  );

  resetButton.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateBoard();
    setMessageBox("Player X's turn");
  });

  const updateBoard = () => {
    for (let i = 0; i < gameElements.length; i++) {
      gameElements[i].textContent = gameBoard.getElement(i);
    }
  };

  const resultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageBox("It's a Draw!");
    } else {
      setMessageBox(`Player ${winner} has won!`);
    }
  };

  const setMessageBox = (message) => {
    messageBox.textContent = message;
  };

  return {resultMessage, setMessageBox};
})();

const gameController = (() => {
  const player1 = player("X");
  const player2 = player("O");
  let round = 1;
  let isOver = false;

  const playRound = (elementIndex) => {
    gameBoard.setElement(elementIndex, getCurrentPlayerMark());
    if (checkWinner(elementIndex)) {
      displayController.resultMessage(getCurrentPlayerMark());
      isOver = true;
      return;
    } if (round === 9) {
      displayController.setMessageBox("Draw")
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageBox(`Player ${getCurrentPlayerMark()}'s turn`);
  };

  const getCurrentPlayerMark = () => {
    return round % 2 === 1 ? player1.getMark() : player2.getMark(); 
  };

  const checkWinner = (elementIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winConditions.filter((combination) => combination.includes(elementIndex)).some((possibleCombination) => possibleCombination.every((index) => gameBoard.getElement(index) === getCurrentPlayerMark()));
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return {playRound, getIsOver, reset};
})();